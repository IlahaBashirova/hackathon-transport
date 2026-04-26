import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";

const importSchema = z.object({
  url: z.string().url("Invalid URL format"),
});

/**
 * Extract readable text from HTML content
 * Removes scripts, styles, nav, and other non-content elements
 */
function extractTextFromHtml(html: string): { text: string; title: string | null } {
  const $ = cheerio.load(html);

  // Get page title
  const title = $("title").text().trim() || $("h1").first().text().trim() || null;

  // Remove non-content elements
  $("script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments").remove();

  // Try to find main content areas
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

  // Try content selectors in order
  for (const selector of contentSelectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 100) {
      extractedText = element.text();
      break;
    }
  }

  // Fallback to body if no content area found
  if (!extractedText) {
    extractedText = $("body").text();
  }

  // Clean up the text
  const cleanText = extractedText
    .replace(/\s+/g, " ")
    .replace(/\n\s*\n/g, "\n")
    .trim()
    .substring(0, 8000); // Limit to 8000 chars for AI processing

  return { text: cleanText, title };
}

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = importSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid URL format", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { url } = validationResult.data;

    // Validate URL is HTTP/HTTPS
    const urlObj = new URL(url);
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return NextResponse.json(
        { error: "Only HTTP and HTTPS URLs are supported" },
        { status: 400 }
      );
    }

    // Fetch the page with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FlowAI/1.0; Event Analysis Bot)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timeout - page took too long to load" },
          { status: 504 }
        );
      }
      throw fetchError;
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: HTTP ${response.status}` },
        { status: 502 }
      );
    }

    // Get content type
    const contentType = response.headers.get("content-type") || "";

    // Handle different content types
    let extractedText: string;
    let pageTitle: string | null = null;

    if (contentType.includes("text/html")) {
      const html = await response.text();
      const extraction = extractTextFromHtml(html);
      extractedText = extraction.text;
      pageTitle = extraction.title;
    } else if (contentType.includes("text/plain")) {
      extractedText = await response.text();
    } else {
      // Try to get text anyway
      extractedText = await response.text();
    }

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json(
        { error: "Page content too short or inaccessible" },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      url,
      extractedText,
      pageTitle,
      contentType,
      textLength: extractedText.length,
    });

  } catch (error) {
    console.error("Event import error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof TypeError && error.message.includes("Invalid URL")) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process URL", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
