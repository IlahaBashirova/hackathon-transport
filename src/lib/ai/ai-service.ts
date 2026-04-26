import { mockAIProvider } from "@/lib/ai/mock-provider";
import {
  openAIProvider,
  isOpenAIConfigured,
} from "@/lib/ai/openai-provider";
import {
  AIProvider,
  EventExtractionInput,
  TransportRecommendationInput,
} from "@/lib/ai/types";

/**
 * Get the appropriate AI provider based on environment configuration
 * - Uses OpenAI if OPENAI_API_KEY is set
 * - Falls back to mock provider otherwise
 */
function getAIProvider(): AIProvider {
  if (isOpenAIConfigured()) {
    console.log("[AI] Using OpenAI provider");
    return openAIProvider;
  }

  console.log("[AI] Using mock provider (no OPENAI_API_KEY set)");
  return mockAIProvider;
}

/**
 * Check if the AI provider is using real AI (OpenAI) or mock
 */
export function isUsingRealAI(): boolean {
  return isOpenAIConfigured();
}

export async function extractEventData(input: EventExtractionInput) {
  const provider = getAIProvider();
  return provider.extractEventData(input);
}

export async function recommendTransportImpact(
  input: TransportRecommendationInput,
) {
  const provider = getAIProvider();
  return provider.recommendTransportImpact(input);
}

// Re-export for use in API routes
export { isOpenAIConfigured } from "@/lib/ai/openai-provider";
