import {
  mockITicketEvents,
  mockUpcomingEventImpacts,
} from "@/lib/mock-data";
import {
  AIProvider,
  EventExtractionInput,
  ExtractedEventData,
  TransportImpactRecommendation,
  TransportRecommendationInput,
} from "@/lib/ai/types";

function pickMockEvent(rawText: string) {
  const hash = Array.from(rawText).reduce(
    (total, char) => total + char.charCodeAt(0),
    0,
  );

  return mockITicketEvents[hash % mockITicketEvents.length];
}

function toExtractedEventData(rawText: string): ExtractedEventData {
  const event = pickMockEvent(rawText);

  return {
    eventName: event.eventName,
    venue: event.venue,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    category: event.category,
    ticketCapacity: event.ticketCapacity,
    estimatedAttendance: event.estimatedAttendance,
    nearestMetroStations: event.nearestMetroStations,
    nearbyBusRoutes: event.nearbyBusRoutes,
    confidence: 0.5,
    sourceUrl: "mock://fallback",
  };
}

function findImpactForEvent(eventName: string) {
  const sourceEvent = mockITicketEvents.find(
    (event) => event.eventName === eventName,
  );

  return mockUpcomingEventImpacts.find(
    (impact) => impact.eventId === sourceEvent?.id,
  );
}

export const mockAIProvider: AIProvider = {
  async extractEventData(
    input: EventExtractionInput,
  ): Promise<ExtractedEventData> {
    return toExtractedEventData(input.rawText);
  },

  async recommendTransportImpact(
    input: TransportRecommendationInput,
  ): Promise<TransportImpactRecommendation> {
    const impact = findImpactForEvent(input.event.eventName);
    const affectedMetroStations =
      impact?.affectedMetroStations ?? input.event.nearestMetroStations;
    const affectedBusRoutes =
      impact?.affectedBusRoutes ?? input.event.nearbyBusRoutes;
    const risk = input.prediction.congestionRisk;

    return {
      congestionRisk: risk,
      congestionSummary: `${input.event.eventName} is expected to create ${risk} congestion around ${input.event.venue}, with peak movement around ${input.prediction.peakTime}.`,
      affectedMetroStations,
      affectedBusRoutes,
      recommendedActions: [
        "Reduce metro interval",
        "Add temporary route",
        "Redirect passengers",
        "Notify users",
      ],
      userFacingAnnouncementText: `High passenger demand is expected near ${input.event.venue}. Use suggested routes, follow station guidance, and allow extra travel time between ${input.prediction.peakTime}.`,
    };
  },
};
