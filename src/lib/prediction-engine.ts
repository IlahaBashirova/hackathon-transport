import { ExtractedEventData, TransportImpactRecommendation } from "@/lib/ai/types";
import {
  CongestionRisk,
  mockBusRoutes,
  mockCongestionLevels,
  mockITicketEvents,
  mockMetroStations,
  mockTransportAlerts,
  mockUpcomingEventImpacts,
  TemporaryRouteSolutionMock,
  UpcomingEventImpactMock,
} from "@/lib/mock-data";

export type ProcessedEventContext = {
  event: ExtractedEventData;
  recommendation: TransportImpactRecommendation;
} | null;

export type NetworkOverviewMetric = {
  label: string;
  value: string;
  detail: string;
  tone: "normal" | "warning" | "danger" | "solution";
};

export type MetroStatus = {
  stationName: string;
  congestionLevel: CongestionRisk;
  expectedPassengerLoad: number;
  affectedEvent: string;
  suggestedAction: string;
};

export type BusRouteStatus = {
  routeNumber: string;
  currentStatus: string;
  congestionImpact: CongestionRisk;
  recommendedAdjustment: string;
};

export type DashboardPredictionState = {
  selectedEventName: string;
  selectedVenue: string;
  selectedImpact: UpcomingEventImpactMock;
  selectedRecommendation: TransportImpactRecommendation;
  overviewMetrics: NetworkOverviewMetric[];
  metroStatuses: MetroStatus[];
  busRouteStatuses: BusRouteStatus[];
  passengerLoadByTime: Array<{
    time: string;
    passengers: number;
    baseline: number;
  }>;
  congestionRiskByStation: Array<{
    station: string;
    load: number;
    risk: number;
  }>;
  eventImpactComparison: Array<{
    event: string;
    attendance: number;
    affectedPassengers: number;
  }>;
  temporaryRoutes: TemporaryRouteSolutionMock[];
};

const defaultEvent = mockITicketEvents[0];
const defaultImpact = mockUpcomingEventImpacts[0];

function parsePassengerImpact(value: string) {
  return Number(value.replace(/,/g, ""));
}

function riskScore(risk: CongestionRisk) {
  return { critical: 100, high: 78, medium: 52, low: 24 }[risk];
}

function getDefaultRecommendation(): TransportImpactRecommendation {
  return {
    affectedBusRoutes: defaultImpact.affectedBusRoutes,
    affectedMetroStations: defaultImpact.affectedMetroStations,
    congestionRisk: defaultEvent.congestionRisk,
    congestionSummary:
      "Caspian Sound Festival is expected to create critical congestion near Baku Crystal Hall and central transfer stations.",
    recommendedActions: [
      "Add temporary route",
      "Reduce metro interval",
      "Redirect passengers",
      "Notify users",
    ],
    userFacingAnnouncementText:
      "Heavy passenger demand is expected near Baku Crystal Hall. Use temporary routes and allow extra travel time.",
  };
}

function findSourceEvent(context: ProcessedEventContext) {
  if (!context) {
    return defaultEvent;
  }

  return (
    mockITicketEvents.find(
      (event) => event.eventName === context.event.eventName,
    ) ?? defaultEvent
  );
}

function findImpact(eventId: string) {
  return (
    mockUpcomingEventImpacts.find((impact) => impact.eventId === eventId) ??
    defaultImpact
  );
}

function suggestedActionForRisk(risk: CongestionRisk) {
  if (risk === "critical") {
    return "Add temporary route and reduce metro interval";
  }

  if (risk === "high") {
    return "Increase service frequency and redirect passengers";
  }

  if (risk === "medium") {
    return "Monitor load and notify users";
  }

  return "Normal monitoring";
}

export function getDashboardPredictionState(
  context: ProcessedEventContext,
): DashboardPredictionState {
  const sourceEvent = findSourceEvent(context);
  const sourceImpact = findImpact(sourceEvent.id);
  const recommendation = context?.recommendation ?? getDefaultRecommendation();
  const selectedImpact: UpcomingEventImpactMock = {
    ...sourceImpact,
    affectedBusRoutes: recommendation.affectedBusRoutes,
    affectedMetroStations: recommendation.affectedMetroStations,
    passengerImpact: (
      context?.event.estimatedAttendance ??
      parsePassengerImpact(sourceImpact.passengerImpact)
    ).toLocaleString(),
    suggestedAction: recommendation.recommendedActions[0] ?? sourceImpact.suggestedAction,
  };
  const selectedEventName = context?.event.eventName ?? sourceEvent.eventName;
  const selectedVenue = context?.event.venue ?? sourceEvent.venue;
  const totalAffectedPassengers = mockUpcomingEventImpacts.reduce(
    (total, impact) => total + parsePassengerImpact(impact.passengerImpact),
    0,
  );
  const totalTemporaryRoutes = mockUpcomingEventImpacts.reduce(
    (total, impact) => total + impact.temporaryRoutes.length,
    0,
  );

  return {
    busRouteStatuses: mockBusRoutes.map((route) => {
      const isAffected = recommendation.affectedBusRoutes.includes(
        route.routeNumber,
      );

      return {
        congestionImpact: isAffected ? route.congestionRisk : "low",
        currentStatus: isAffected ? "Reinforcement needed" : "Normal",
        recommendedAdjustment: isAffected
          ? `Add ${route.recommendedExtraBuses} extra buses`
          : "Maintain schedule",
        routeNumber: route.routeNumber,
      };
    }),
    congestionRiskByStation: mockMetroStations.map((station) => ({
      load: station.projectedLoad,
      risk: riskScore(station.congestionRisk),
      station: station.name,
    })),
    eventImpactComparison: mockITicketEvents.map((event) => {
      const impact = findImpact(event.id);

      return {
        affectedPassengers: parsePassengerImpact(impact.passengerImpact),
        attendance: event.estimatedAttendance,
        event: event.venue,
      };
    }),
    metroStatuses: mockMetroStations.map((station) => {
      const isAffected = recommendation.affectedMetroStations.includes(
        station.name,
      );

      return {
        affectedEvent: isAffected ? selectedEventName : "Network baseline",
        congestionLevel: isAffected ? station.congestionRisk : "low",
        expectedPassengerLoad: isAffected
          ? station.projectedLoad
          : station.currentLoad,
        stationName: station.name,
        suggestedAction: isAffected
          ? suggestedActionForRisk(station.congestionRisk)
          : "Normal monitoring",
      };
    }),
    overviewMetrics: [
      {
        detail: "iTicket events in model",
        label: "Active events",
        tone: "solution",
        value: `${mockITicketEvents.length}`,
      },
      {
        detail: "event-driven demand",
        label: "Affected passengers",
        tone: "warning",
        value: totalAffectedPassengers.toLocaleString(),
      },
      {
        detail: "red problem zones",
        label: "Congestion zones",
        tone: "danger",
        value: `${mockCongestionLevels.length}`,
      },
      {
        detail: "cyan/blue solutions",
        label: "Temporary routes",
        tone: "solution",
        value: `${totalTemporaryRoutes}`,
      },
      {
        detail: "operator queue",
        label: "Active alerts",
        tone: "warning",
        value: `${mockTransportAlerts.length}`,
      },
    ],
    passengerLoadByTime: [
      { baseline: 1800, passengers: 2400, time: "16:00" },
      { baseline: 2600, passengers: 4200, time: "17:00" },
      { baseline: 4100, passengers: 7600, time: "18:00" },
      { baseline: 5200, passengers: 9800, time: "19:00" },
      { baseline: 4700, passengers: 8400, time: "20:00" },
      { baseline: 3200, passengers: 6100, time: "21:00" },
    ],
    selectedEventName,
    selectedImpact,
    selectedRecommendation: recommendation,
    selectedVenue,
    temporaryRoutes: selectedImpact.temporaryRoutes,
  };
}
