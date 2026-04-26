import { CongestionRisk } from "@/lib/mock-data";

export type EventCategory = "concert" | "sport" | "theatre" | "expo" | "conference" | "other" | "culture";

export type ExtractedEventData = {
  eventName: string;
  venue: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  category: EventCategory;
  ticketCapacity: number | null;
  estimatedAttendance: number | null;
  nearestMetroStations: string[];
  nearbyBusRoutes: string[];
  confidence: number;
  sourceUrl: string;
};

export type PredictionEngineResult = {
  congestionRisk: CongestionRisk;
  passengerImpact: string;
  peakTime: string;
  confidence: number;
  expectedAttendance: number;
  expectedPublicTransportPassengers: number;
  metroPassengers: number;
  busPassengers: number;
  metroCongestionScore: number;
  busCongestionScore: number;
  peakArrivalWindow: string;
  peakExitWindow: string;
  isBasedOnRealCapacity: boolean;
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

export type ProcessingStatus = {
  urlFetch: "real" | "failed" | "fallback";
  aiProvider: "openai" | "mock";
  prediction: "formula-based" | "mock";
  usingDemoFallback: boolean;
};

export type AIProvider = {
  extractEventData(input: EventExtractionInput): Promise<ExtractedEventData>;
  recommendTransportImpact(
    input: TransportRecommendationInput,
  ): Promise<TransportImpactRecommendation>;
};
