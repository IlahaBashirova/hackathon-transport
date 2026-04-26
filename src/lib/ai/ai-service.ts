import { mockAIProvider } from "@/lib/ai/mock-provider";
import {
  AIProvider,
  EventExtractionInput,
  TransportRecommendationInput,
} from "@/lib/ai/types";

function getAIProvider(): AIProvider {
  // Real AI integration goes here.
  // Replace `mockAIProvider` with an OpenAI or Gemini provider that implements
  // the same AIProvider interface. Keep provider calls server-side so API keys
  // stay in environment variables and never ship to the browser.
  return mockAIProvider;
}

export async function extractEventData(input: EventExtractionInput) {
  return getAIProvider().extractEventData(input);
}

export async function recommendTransportImpact(
  input: TransportRecommendationInput,
) {
  return getAIProvider().recommendTransportImpact(input);
}
