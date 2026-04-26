import OpenAI from "openai";
import {
  AIProvider,
  EventExtractionInput,
  ExtractedEventData,
  TransportImpactRecommendation,
  TransportRecommendationInput,
} from "@/lib/ai/types";

// Lazy-loaded OpenAI client to prevent build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Check if OpenAI is configured and available
 */
export function isOpenAIConfigured(): boolean {
  const apiKey = process.env.OPENAI_API_KEY;
  return !!apiKey && apiKey.length > 10 && apiKey.startsWith("sk-");
}

/**
 * Extract event data from raw text using OpenAI
 */
async function extractWithOpenAI(
  rawText: string,
  sourceUrl: string,
): Promise<ExtractedEventData> {
  const systemPrompt = `You are an event data extraction specialist. Extract structured event information from the provided text.

Rules:
1. Extract only what is explicitly stated or can be reasonably inferred from the text
2. If ticketCapacity is not visible, set it to null (do not hallucinate)
3. Use estimatedAttendance only if explicitly mentioned or as a venue-based estimate
4. For dates and times, use ISO format where possible
5. Identify nearest metro stations and bus routes if mentioned or infer from venue location
6. Set confidence 0-1 based on data quality and completeness
7. Category must be one of: concert, sport, theatre, expo, conference, other

Return strict JSON matching this schema:
{
  "eventName": string,
  "venue": string,
  "date": string | null (ISO date YYYY-MM-DD),
  "startTime": string | null (HH:MM),
  "endTime": string | null (HH:MM),
  "category": "concert" | "sport" | "theatre" | "expo" | "conference" | "other",
  "ticketCapacity": number | null,
  "estimatedAttendance": number | null,
  "nearestMetroStations": string[],
  "nearbyBusRoutes": string[],
  "confidence": number (0-1),
  "extractionNotes": string (explain any estimates or missing data)
}`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini", // Using mini for cost efficiency in hackathon
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Extract event data from this text. Source URL: ${sourceUrl}\n\nText:\n${rawText.substring(0, 6000)}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3, // Low temperature for consistent extraction
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const extracted = JSON.parse(content);

  // Map to our type, handling nulls properly
  return {
    eventName: extracted.eventName || "Unknown Event",
    venue: extracted.venue || "Unknown Venue",
    date: extracted.date || null,
    startTime: extracted.startTime || null,
    endTime: extracted.endTime || null,
    category: extracted.category || "other",
    ticketCapacity: extracted.ticketCapacity ?? null,
    estimatedAttendance: extracted.estimatedAttendance ?? null,
    nearestMetroStations: extracted.nearestMetroStations || [],
    nearbyBusRoutes: extracted.nearbyBusRoutes || [],
    confidence: extracted.confidence || 0.5,
    sourceUrl,
  };
}

/**
 * Generate transport impact recommendation using OpenAI
 */
async function recommendWithOpenAI(
  input: TransportRecommendationInput,
): Promise<TransportImpactRecommendation> {
  const { event, prediction } = input;

  const systemPrompt = `You are a transport planning AI. Based on the event data and predicted impact, generate actionable recommendations.

Rules:
1. Be specific about affected stations and routes
2. Provide concrete, actionable recommendations
3. Write user-facing text in a helpful, clear tone
4. Consider the event category, venue, and predicted attendance

Return strict JSON matching this schema:
{
  "congestionSummary": string (detailed explanation of expected congestion),
  "recommendedActions": string[] (3-5 specific actions for operators),
  "userFacingAnnouncementText": string (helpful message for passengers)
}`;

  const userPrompt = `Event: ${event.eventName}
Venue: ${event.venue}
Category: ${event.category}
Expected Attendance: ${prediction.expectedAttendance}
Public Transport Passengers: ${prediction.expectedPublicTransportPassengers}
Congestion Risk: ${prediction.congestionRisk}
Metro Stations: ${event.nearestMetroStations.join(", ")}
Bus Routes: ${event.nearbyBusRoutes.join(", ")}
Peak Time: ${prediction.peakTime}`;

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const generated = JSON.parse(content);

  return {
    congestionRisk: prediction.congestionRisk,
    congestionSummary:
      generated.congestionSummary ||
      `${event.eventName} at ${event.venue} is expected to create ${prediction.congestionRisk} congestion.`,
    affectedMetroStations: event.nearestMetroStations,
    affectedBusRoutes: event.nearbyBusRoutes,
    recommendedActions: generated.recommendedActions || [
      "Reduce metro interval",
      "Add temporary route",
    ],
    userFacingAnnouncementText:
      generated.userFacingAnnouncementText ||
      `High passenger demand expected near ${event.venue}. Allow extra travel time.`,
  };
}

/**
 * OpenAI provider implementing AIProvider interface
 */
export const openAIProvider: AIProvider = {
  async extractEventData(
    input: EventExtractionInput,
  ): Promise<ExtractedEventData> {
    // Parse the raw text to get source URL if embedded
    const lines = input.rawText.split("\n");
    let sourceUrl = "unknown";
    let actualText = input.rawText;

    // Check if first line contains URL info from our import API
    if (lines[0]?.startsWith("Source URL:")) {
      sourceUrl = lines[0].replace("Source URL:", "").trim();
      actualText = lines.slice(1).join("\n");
    }

    return extractWithOpenAI(actualText, sourceUrl);
  },

  async recommendTransportImpact(
    input: TransportRecommendationInput,
  ): Promise<TransportImpactRecommendation> {
    return recommendWithOpenAI(input);
  },
};
