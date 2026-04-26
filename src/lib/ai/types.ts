import { CongestionRisk } from "@/lib/mock-data";

export type ExtractedEventData = {
  eventName: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  category: "concert" | "conference" | "sport" | "culture";
  ticketCapacity: number;
  estimatedAttendance: number;
  nearestMetroStations: string[];
  nearbyBusRoutes: string[];
};

export type PredictionEngineResult = {
  congestionRisk: CongestionRisk;
  passengerImpact: string;
  peakTime: string;
  confidence: number;
};

export type TransportImpactRecommendation = {
  congestionSummary: string;
  congestionRisk: CongestionRisk;
  affectedMetroStations: string[];
  affectedBusRoutes: string[];
  recommendedActions: string[];
  userFacingAnnouncementText: string;
};

export type EventExtractionInput = {
  rawText: string;
};

export type TransportRecommendationInput = {
  event: ExtractedEventData;
  prediction: PredictionEngineResult;
};

export type AIProvider = {
  extractEventData(input: EventExtractionInput): Promise<ExtractedEventData>;
  recommendTransportImpact(
    input: TransportRecommendationInput,
  ): Promise<TransportImpactRecommendation>;
};
