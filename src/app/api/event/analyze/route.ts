import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";
import { extractEventData, isOpenAIConfigured } from "@/lib/ai";
import {
  calculateTransportImpact,
  generateRecommendedActions,
} from "@/lib/ai/prediction-engine";
import {
  ExtractedEventData,
  ProcessingStatus,
  TransportImpactRecommendation,
} from "@/lib/ai/types";
import {
  mockITicketEvents,
  mockUpcomingEventImpacts,
  CongestionRisk,
} from "@/lib/mock-data";

const analyzeSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

/**
 * Extract readable text from HTML content
 */
function extractTextFromHtml(html: string): { text: string; title: string | null } {
  const $ = cheerio.load(html);
  const title = $("title").text().trim() || $("h1").first().text().trim() || null;

  $("script, style, nav, header, footer, aside, .advertisement, .ads").remove();

  const contentSelectors = [
    "main",
    "article",
    "[role='main']",
    ".content",
    ".main-content",
    ".event-details",
    ".event-info",
    ".event-description",
    "#content",
    ".container",
  ];

  let extractedText = "";
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      extractedText = element.text();
      break;
    }
  }

  if (!extractedText) {
    extractedText = $("body").text();
  }

  const cleanText = extractedText
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim()
    .substring(0, 8000);

  return { text: cleanText, title };
}

/**
 * Get mock fallback data based on URL hash
 */
function getMockFallbackData(url: string): {
  event: ExtractedEventData;
  recommendation: TransportImpactRecommendation;
  status: ProcessingStatus;
} {
  // Pick mock event based on URL hash
  const hash = Array.from(url).reduce((total, char) => total + char.charCodeAt(0), 0);
  const mockEvent = mockITicketEvents[hash % mockITicketEvents.length];
  const impact = mockUpcomingEventImpacts.find((i) => i.eventId === mockEvent.id);

  const event: ExtractedEventData = {
    eventName: mockEvent.eventName,
    venue: mockEvent.venue,
    date: mockEvent.date,
    startTime: mockEvent.startTime,
    endTime: mockEvent.endTime,
    category: mockEvent.category,
    ticketCapacity: mockEvent.ticketCapacity,
    estimatedAttendance: mockEvent.estimatedAttendance,
    nearestMetroStations: mockEvent.nearestMetroStations,
    nearbyBusRoutes: mockEvent.nearbyBusRoutes,
    confidence: 0.5,
    sourceUrl: url,
  };

  const congestionRisk: CongestionRisk = mockEvent.congestionRisk ?? "high";

  const recommendation: TransportImpactRecommendation = {
    congestionRisk,
    congestionSummary: `${mockEvent.eventName} is expected to create ${congestionRisk} congestion around ${mockEvent.venue}.`,
    affectedMetroStations: impact?.affectedMetroStations ?? mockEvent.nearestMetroStations,
    affectedBusRoutes: impact?.affectedBusRoutes ?? mockEvent.nearbyBusRoutes,
    recommendedActions: ["Reduce metro interval", "Add temporary route", "Notify users"],
    userFacingAnnouncementText: `High passenger demand expected near ${mockEvent.venue}.`,
  };

  const status: ProcessingStatus = {
    urlFetch: "fallback",
    aiProvider: "mock",
    prediction: "mock",
    usingDemoFallback: true,
  };

  return { event, recommendation, status };
}

export async function POST(request: Request) {
  const startTime = Date.now();
  let body: unknown;

  try {
    // Parse and validate request
    body = await request.json();
    const validationResult = analyzeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid URL format", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { url } = validationResult.data;

    // Initialize status tracking
    const status: ProcessingStatus = {
      urlFetch: "failed",
      aiProvider: isOpenAIConfigured() ? "openai" : "mock",
      prediction: "mock",
      usingDemoFallback: false,
    };

    let extractedText: string | null = null;
    let extractedEvent: ExtractedEventData;

    // Step 1: Fetch URL
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FlowAI/1.0; Event Analysis Bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        const html = await response.text();
        const extraction = extractTextFromHtml(html);
        extractedText = extraction.text;
        status.urlFetch = "real";
      }
    } catch (fetchError) {
      console.error("[Analyze] URL fetch failed:", fetchError);
      status.urlFetch = "failed";
    }

    // Step 2: Extract event data with AI or fallback to mock
    try {
      if (extractedText && extractedText.length > 100) {
        // Use real extraction
        const textForAI = `Source URL: ${url}\n${extractedText}`;
        extractedEvent = await extractEventData({ rawText: textForAI });
        status.aiProvider = isOpenAIConfigured() ? "openai" : "mock";
      } else {
        throw new Error("No content extracted or content too short");
      }
    } catch (extractError) {
      console.error("[Analyze] Extraction failed, using mock:", extractError);
      // Return mock fallback
      const fallback = getMockFallbackData(url);
      return NextResponse.json({
        success: true,
        event: fallback.event,
        recommendation: fallback.recommendation,
        status: fallback.status,
        timing: { totalMs: Date.now() - startTime },
        warning: "Demo fallback data used - could not fetch or extract from URL",
      });
    }

    // Step 3: Calculate prediction with real engine
    let prediction;
    try {
      prediction = calculateTransportImpact({
        ticketCapacity: extractedEvent.ticketCapacity,
        estimatedAttendance: extractedEvent.estimatedAttendance,
        category: extractedEvent.category,
        venue: extractedEvent.venue,
        date: extractedEvent.date,
        startTime: extractedEvent.startTime,
        endTime: extractedEvent.endTime,
        nearestMetroStations: extractedEvent.nearestMetroStations,
        nearbyBusRoutes: extractedEvent.nearbyBusRoutes,
        extractionConfidence: extractedEvent.confidence,
      });
      status.prediction = "formula-based";
    } catch (predError) {
      console.error("[Analyze] Prediction calculation failed:", predError);
      // Use fallback prediction
      prediction = {
        congestionRisk: "high" as CongestionRisk,
        passengerImpact: "5,000",
        peakTime: "18:00-19:30",
        confidence: 0.5,
        expectedAttendance: 8000,
        expectedPublicTransportPassengers: 4800,
        metroPassengers: 3120,
        busPassengers: 1680,
        metroCongestionScore: 65,
        busCongestionScore: 55,
        peakArrivalWindow: "17:00-18:30",
        peakExitWindow: "21:00-22:30",
        isBasedOnRealCapacity: false,
      };
    }

    // Step 4: Generate recommendation
    const recommendedActions = generateRecommendedActions(
      prediction.congestionRisk,
      prediction.metroCongestionScore,
      prediction.busCongestionScore,
    );

    const recommendation: TransportImpactRecommendation = {
      congestionRisk: prediction.congestionRisk,
      congestionSummary: `${extractedEvent.eventName} at ${extractedEvent.venue} is expected to create ${prediction.congestionRisk} congestion with approximately ${prediction.expectedPublicTransportPassengers.toLocaleString()} public transport passengers.`,
      affectedMetroStations: extractedEvent.nearestMetroStations,
      affectedBusRoutes: extractedEvent.nearbyBusRoutes,
      recommendedActions,
      userFacingAnnouncementText: `High passenger demand expected near ${extractedEvent.venue} between ${prediction.peakArrivalWindow} and ${prediction.peakExitWindow}. Allow extra travel time and consider alternative routes.`,
    };

    return NextResponse.json({
      success: true,
      event: extractedEvent,
      prediction,
      recommendation,
      status,
      timing: {
        totalMs: Date.now() - startTime,
      },
    });

  } catch (error) {
    console.error("[Analyze] Fatal error:", error);

    // Ultimate fallback - use generic URL since we may not have parsed body
    const fallbackUrl = (typeof body === "object" && body && "url" in body && typeof body.url === "string") 
      ? body.url 
      : "unknown";
    const fallback = getMockFallbackData(fallbackUrl);

    return NextResponse.json({
      success: true,
      event: fallback.event,
      recommendation: fallback.recommendation,
      status: fallback.status,
      warning: "Demo fallback data used due to processing error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
