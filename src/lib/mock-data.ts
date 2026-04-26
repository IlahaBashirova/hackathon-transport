export type Coordinates = {
  lat: number;
  lng: number;
};

export type CongestionRisk = "low" | "medium" | "high" | "critical";

export type ITicketEventMock = {
  id: string;
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
  coordinates: Coordinates;
  congestionRisk: CongestionRisk;
};

export type MetroStationMock = {
  id: string;
  name: string;
  line: "red" | "green" | "purple";
  coordinates: Coordinates;
  currentLoad: number;
  projectedLoad: number;
  congestionRisk: CongestionRisk;
  connectedBusRoutes: string[];
};

export type BusRouteMock = {
  id: string;
  routeNumber: string;
  name: string;
  from: string;
  to: string;
  activeBuses: number;
  recommendedExtraBuses: number;
  congestionRisk: CongestionRisk;
};

export type CongestionLevelMock = {
  id: string;
  area: string;
  targetType: "metro" | "bus" | "venue" | "corridor";
  level: CongestionRisk;
  score: number;
  predictedPeakTime: string;
  affectedEvents: string[];
};

export type TransportAlertMock = {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  location: string;
  time: string;
  message: string;
  recommendedAction: string;
  relatedEventId?: string;
};

export type RouteSuggestionMock = {
  id: string;
  title: string;
  from: string;
  to: string;
  estimatedTimeMinutes: number;
  crowdLevel: CongestionRisk;
  transportModes: Array<"metro" | "bus" | "walk" | "temporary-route">;
  instructions: string[];
};

export type TemporaryRouteSolutionMock = {
  id: string;
  label: string;
  from: string;
  to: string;
  expectedActiveTime: string;
  transportType: "metro" | "bus";
  reason: string;
  path: string;
  startPoint: { x: string; y: string };
  endPoint: { x: string; y: string };
};

export type ImpactMapMarkerMock = {
  id: string;
  label: string;
  x: string;
  y: string;
  type: "station" | "bus-stop" | "congestion";
};

export type UpcomingEventImpactMock = {
  eventId: string;
  passengerImpact: string;
  peakTime: string;
  suggestedAction: string;
  affectedMetroStations: string[];
  affectedBusRoutes: string[];
  congestionZones: ImpactMapMarkerMock[];
  crowdMarkers: ImpactMapMarkerMock[];
  temporaryRoutes: TemporaryRouteSolutionMock[];
};

export type RoutePlannerMode =
  | "metro-only"
  | "bus-only"
  | "metro-bus"
  | "bolt"
  | "apara";

export type RoutePlannerOptionMock = {
  id: string;
  title: string;
  mode: RoutePlannerMode;
  from: string;
  to: string;
  estimatedTimeMinutes: number;
  estimatedCost: number;
  crowdLevel: CongestionRisk;
  transportType: string;
  steps: string[];
};

export type MobilityAlertType =
  | "metro-station-issue"
  | "road-closure"
  | "bus-route-changed"
  | "event-crowd-warning"
  | "technical-delay";

export type MobilityAlertSeverity = "info" | "warning" | "danger" | "success";

export type MobilityAlertStatus =
  | "active"
  | "monitoring"
  | "resolved"
  | "scheduled";

export type MobilityAlertMock = {
  id: string;
  type: MobilityAlertType;
  title: string;
  description: string;
  severity: MobilityAlertSeverity;
  affectedLocation: string;
  time: string;
  status: MobilityAlertStatus;
};

export const mockITicketEvents: ITicketEventMock[] = [
  {
    id: "evt-crystal-001",
    eventName: "Caspian Sound Festival",
    venue: "Baku Crystal Hall",
    date: "2026-04-26",
    startTime: "19:30",
    endTime: "22:15",
    category: "concert",
    ticketCapacity: 23000,
    estimatedAttendance: 19600,
    nearestMetroStations: ["Sahil", "İçərişəhər", "28 May"],
    nearbyBusRoutes: ["5", "10", "18", "88"],
    coordinates: { lat: 40.3442, lng: 49.8501 },
    congestionRisk: "critical",
  },
  {
    id: "evt-heydar-002",
    eventName: "Innovation Leaders Forum",
    venue: "Heydər Əliyev Sarayı",
    date: "2026-04-27",
    startTime: "18:00",
    endTime: "21:00",
    category: "conference",
    ticketCapacity: 2100,
    estimatedAttendance: 1850,
    nearestMetroStations: ["28 May", "Nizami", "Sahil"],
    nearbyBusRoutes: ["1", "2", "14", "65"],
    coordinates: { lat: 40.3777, lng: 49.8407 },
    congestionRisk: "high",
  },
  {
    id: "evt-stadium-003",
    eventName: "Baku Derby Final",
    venue: "Bakı Olimpiya Stadionu",
    date: "2026-04-28",
    startTime: "20:45",
    endTime: "22:40",
    category: "sport",
    ticketCapacity: 68700,
    estimatedAttendance: 54200,
    nearestMetroStations: ["Koroğlu", "Gənclik", "28 May"],
    nearbyBusRoutes: ["13", "38", "60", "93", "184"],
    coordinates: { lat: 40.4302, lng: 49.9197 },
    congestionRisk: "critical",
  },
  {
    id: "evt-oldcity-004",
    eventName: "Old City Culture Night",
    venue: "İçərişəhər Open Air Stage",
    date: "2026-04-29",
    startTime: "18:30",
    endTime: "21:30",
    category: "culture",
    ticketCapacity: 5200,
    estimatedAttendance: 4300,
    nearestMetroStations: ["İçərişəhər", "Sahil", "Nizami"],
    nearbyBusRoutes: ["6", "18", "65", "88"],
    coordinates: { lat: 40.3667, lng: 49.8372 },
    congestionRisk: "medium",
  },
];

export const mockMetroStations: MetroStationMock[] = [
  {
    id: "metro-sahil",
    name: "Sahil",
    line: "red",
    coordinates: { lat: 40.371, lng: 49.8457 },
    currentLoad: 61,
    projectedLoad: 82,
    congestionRisk: "high",
    connectedBusRoutes: ["5", "10", "18", "88"],
  },
  {
    id: "metro-28may",
    name: "28 May",
    line: "red",
    coordinates: { lat: 40.3794, lng: 49.8486 },
    currentLoad: 68,
    projectedLoad: 94,
    congestionRisk: "critical",
    connectedBusRoutes: ["1", "2", "14", "65", "88"],
  },
  {
    id: "metro-icherisheher",
    name: "İçərişəhər",
    line: "red",
    coordinates: { lat: 40.3656, lng: 49.8329 },
    currentLoad: 49,
    projectedLoad: 73,
    congestionRisk: "high",
    connectedBusRoutes: ["6", "18", "65"],
  },
  {
    id: "metro-genclik",
    name: "Gənclik",
    line: "red",
    coordinates: { lat: 40.4007, lng: 49.8519 },
    currentLoad: 57,
    projectedLoad: 86,
    congestionRisk: "high",
    connectedBusRoutes: ["11", "13", "38", "60"],
  },
  {
    id: "metro-nizami",
    name: "Nizami",
    line: "green",
    coordinates: { lat: 40.3772, lng: 49.8264 },
    currentLoad: 42,
    projectedLoad: 64,
    congestionRisk: "medium",
    connectedBusRoutes: ["14", "37", "65"],
  },
];

export const mockBusRoutes: BusRouteMock[] = [
  {
    id: "bus-5",
    routeNumber: "5",
    name: "Crystal Hall coastal connector",
    from: "Sahil",
    to: "Baku Crystal Hall",
    activeBuses: 9,
    recommendedExtraBuses: 5,
    congestionRisk: "high",
  },
  {
    id: "bus-13",
    routeNumber: "13",
    name: "Gənclik stadium feeder",
    from: "Gənclik",
    to: "Bakı Olimpiya Stadionu",
    activeBuses: 14,
    recommendedExtraBuses: 8,
    congestionRisk: "critical",
  },
  {
    id: "bus-65",
    routeNumber: "65",
    name: "Central cultural loop",
    from: "Nizami",
    to: "İçərişəhər",
    activeBuses: 11,
    recommendedExtraBuses: 2,
    congestionRisk: "medium",
  },
  {
    id: "bus-88",
    routeNumber: "88",
    name: "28 May coastal express",
    from: "28 May",
    to: "Baku Crystal Hall",
    activeBuses: 12,
    recommendedExtraBuses: 6,
    congestionRisk: "high",
  },
];

export const mockCongestionLevels: CongestionLevelMock[] = [
  {
    id: "cong-28may",
    area: "28 May interchange",
    targetType: "metro",
    level: "critical",
    score: 94,
    predictedPeakTime: "22:35",
    affectedEvents: ["evt-crystal-001", "evt-stadium-003"],
  },
  {
    id: "cong-crystal-corridor",
    area: "Baku Crystal Hall coastal corridor",
    targetType: "corridor",
    level: "high",
    score: 86,
    predictedPeakTime: "22:20",
    affectedEvents: ["evt-crystal-001"],
  },
  {
    id: "cong-genclik",
    area: "Gənclik station exits",
    targetType: "metro",
    level: "high",
    score: 83,
    predictedPeakTime: "23:05",
    affectedEvents: ["evt-stadium-003"],
  },
  {
    id: "cong-oldcity",
    area: "İçərişəhər pedestrian zone",
    targetType: "venue",
    level: "medium",
    score: 62,
    predictedPeakTime: "21:40",
    affectedEvents: ["evt-oldcity-004"],
  },
];

export const mockTransportAlerts: TransportAlertMock[] = [
  {
    id: "alert-001",
    severity: "critical",
    title: "Metro crowd surge expected",
    location: "28 May",
    time: "22:30",
    message:
      "Two major event exits overlap and are projected to push platform load above 90%.",
    recommendedAction:
      "Reduce metro interval and deploy additional platform staff from 22:10.",
    relatedEventId: "evt-crystal-001",
  },
  {
    id: "alert-002",
    severity: "warning",
    title: "Temporary bus route recommended",
    location: "Bakı Olimpiya Stadionu",
    time: "22:45",
    message:
      "Stadium exit wave will exceed active bus capacity on feeder routes to Gənclik.",
    recommendedAction:
      "Add temporary express route from stadium perimeter to Gənclik and 28 May.",
    relatedEventId: "evt-stadium-003",
  },
  {
    id: "alert-003",
    severity: "info",
    title: "Passenger redirection window",
    location: "İçərişəhər",
    time: "21:20",
    message:
      "Moderate crowding expected near Old City exits after the cultural program.",
    recommendedAction:
      "Notify users to split between İçərişəhər, Sahil, and Nizami stations.",
    relatedEventId: "evt-oldcity-004",
  },
];

export const mockRouteSuggestions: RouteSuggestionMock[] = [
  {
    id: "route-crystal-28may",
    title: "Crystal Hall to 28 May crowd-safe route",
    from: "Baku Crystal Hall",
    to: "28 May",
    estimatedTimeMinutes: 31,
    crowdLevel: "high",
    transportModes: ["walk", "temporary-route", "metro"],
    instructions: [
      "Walk to coastal temporary shuttle point.",
      "Use express shuttle toward Sahil.",
      "Transfer to metro or continue by bus toward 28 May.",
    ],
  },
  {
    id: "route-stadium-genclik",
    title: "Olympic Stadium to Gənclik relief route",
    from: "Bakı Olimpiya Stadionu",
    to: "Gənclik",
    estimatedTimeMinutes: 42,
    crowdLevel: "critical",
    transportModes: ["temporary-route", "bus", "metro"],
    instructions: [
      "Use temporary stadium loop from north gate.",
      "Board route 13 reinforcement service.",
      "Avoid Koroğlu during the first 25 minutes after final whistle.",
    ],
  },
  {
    id: "route-heydar-sahil",
    title: "Heydər Əliyev Sarayı to Sahil balanced route",
    from: "Heydər Əliyev Sarayı",
    to: "Sahil",
    estimatedTimeMinutes: 18,
    crowdLevel: "medium",
    transportModes: ["walk", "metro"],
    instructions: [
      "Walk toward 28 May after the first exit wave.",
      "Use Sahil-bound metro if platform load remains below 70%.",
    ],
  },
];

export const mockRoutePlannerOptions: RoutePlannerOptionMock[] = [
  {
    id: "planner-metro-only",
    title: "Metro only",
    mode: "metro-only",
    from: "Bakı Olimpiya Stadionu",
    to: "28 May",
    estimatedTimeMinutes: 36,
    estimatedCost: 0.8,
    crowdLevel: "high",
    transportType: "Metro",
    steps: ["Walk to Koroğlu", "Metro to 28 May", "Exit via north concourse"],
  },
  {
    id: "planner-bus-only",
    title: "Bus only",
    mode: "bus-only",
    from: "Bakı Olimpiya Stadionu",
    to: "28 May",
    estimatedTimeMinutes: 54,
    estimatedCost: 0.7,
    crowdLevel: "medium",
    transportType: "BakuBus",
    steps: ["Route 13 feeder", "Transfer to Route 88", "Arrive near 28 May"],
  },
  {
    id: "planner-metro-bus",
    title: "Metro + bus",
    mode: "metro-bus",
    from: "Bakı Olimpiya Stadionu",
    to: "28 May",
    estimatedTimeMinutes: 42,
    estimatedCost: 1.1,
    crowdLevel: "low",
    transportType: "Metro + BakuBus",
    steps: ["Temporary shuttle to Gənclik", "Metro to 28 May"],
  },
  {
    id: "planner-bolt",
    title: "Bolt option",
    mode: "bolt",
    from: "Bakı Olimpiya Stadionu",
    to: "28 May",
    estimatedTimeMinutes: 28,
    estimatedCost: 8.5,
    crowdLevel: "medium",
    transportType: "Bolt",
    steps: ["Pickup at rideshare zone B", "Recommended route via Heydər Əliyev Ave"],
  },
  {
    id: "planner-apara",
    title: "Apara option",
    mode: "apara",
    from: "Bakı Olimpiya Stadionu",
    to: "28 May",
    estimatedTimeMinutes: 31,
    estimatedCost: 6.4,
    crowdLevel: "low",
    transportType: "Apara",
    steps: ["Pickup from event mobility hub", "Shared ride to 28 May"],
  },
];

export const mockMobilityAlerts: MobilityAlertMock[] = [
  {
    id: "mobility-alert-metro-001",
    type: "metro-station-issue",
    title: "Platform crowding at 28 May",
    description:
      "Passenger density is rising on the northbound platform after overlapping event exit waves.",
    severity: "danger",
    affectedLocation: "28 May Metro Station",
    time: "19:08",
    status: "active",
  },
  {
    id: "mobility-alert-road-002",
    type: "road-closure",
    title: "Coastal road lane restriction",
    description:
      "One lane near Baku Crystal Hall is restricted for event security and shuttle staging.",
    severity: "warning",
    affectedLocation: "Baku Crystal Hall corridor",
    time: "18:45",
    status: "scheduled",
  },
  {
    id: "mobility-alert-bus-003",
    type: "bus-route-changed",
    title: "Route 88 temporary diversion",
    description:
      "BakuBus Route 88 is redirected through the temporary event stop near Sahil.",
    severity: "info",
    affectedLocation: "Route 88 / Sahil",
    time: "18:20",
    status: "active",
  },
  {
    id: "mobility-alert-crowd-004",
    type: "event-crowd-warning",
    title: "High crowd release expected",
    description:
      "Caspian Sound Festival exit flow is forecast to peak between 21:45 and 23:00.",
    severity: "warning",
    affectedLocation: "Baku Crystal Hall",
    time: "17:55",
    status: "monitoring",
  },
  {
    id: "mobility-alert-tech-005",
    type: "technical-delay",
    title: "Display board sync restored",
    description:
      "Passenger information displays at Gənclik are back online after a short data sync delay.",
    severity: "success",
    affectedLocation: "Gənclik Metro Station",
    time: "17:30",
    status: "resolved",
  },
];

export const mockUpcomingEventImpacts: UpcomingEventImpactMock[] = [
  {
    eventId: "evt-crystal-001",
    passengerImpact: "8,500",
    peakTime: "21:45-23:00",
    suggestedAction: "Add temporary route",
    affectedMetroStations: ["Sahil", "28 May", "İçərişəhər"],
    affectedBusRoutes: ["5", "10", "18", "88"],
    congestionZones: [
      {
        id: "zone-crystal",
        label: "Crystal Hall exit zone",
        x: "21%",
        y: "70%",
        type: "congestion",
      },
      {
        id: "zone-sahil",
        label: "Sahil transfer pressure",
        x: "48%",
        y: "48%",
        type: "congestion",
      },
    ],
    crowdMarkers: [
      {
        id: "crowd-crystal-main",
        label: "Expected crowd density",
        x: "25%",
        y: "66%",
        type: "congestion",
      },
      {
        id: "crowd-28may",
        label: "Platform load spike",
        x: "66%",
        y: "36%",
        type: "congestion",
      },
    ],
    temporaryRoutes: [
      {
        id: "tmp-crystal-28may",
        label: "New Temporary Bus Route",
        from: "28 May",
        to: "Baku Crystal Hall",
        expectedActiveTime: "20:30-23:30",
        transportType: "bus",
        reason: "event crowd support",
        path: "M110 245 C205 195 280 175 395 122",
        startPoint: { x: "66%", y: "38%" },
        endPoint: { x: "22%", y: "72%" },
      },
      {
        id: "metro-sahil-28may",
        label: "Extra Metro Support",
        from: "Sahil",
        to: "28 May",
        expectedActiveTime: "21:20-23:10",
        transportType: "metro",
        reason: "event crowd support",
        path: "M246 170 C290 148 333 133 395 122",
        startPoint: { x: "48%", y: "50%" },
        endPoint: { x: "66%", y: "38%" },
      },
    ],
  },
  {
    eventId: "evt-heydar-002",
    passengerImpact: "3,200",
    peakTime: "18:00-19:30",
    suggestedAction: "Redirect passengers",
    affectedMetroStations: ["28 May", "Nizami", "Sahil"],
    affectedBusRoutes: ["1", "2", "14", "65"],
    congestionZones: [
      {
        id: "zone-heydar",
        label: "Palace exit queue",
        x: "57%",
        y: "44%",
        type: "congestion",
      },
    ],
    crowdMarkers: [
      {
        id: "crowd-heydar-main",
        label: "Arrival peak",
        x: "55%",
        y: "45%",
        type: "congestion",
      },
    ],
    temporaryRoutes: [
      {
        id: "tmp-heydar-sahil",
        label: "New Temporary Bus Route",
        from: "Heydər Əliyev Sarayı",
        to: "Sahil",
        expectedActiveTime: "17:30-21:30",
        transportType: "bus",
        reason: "event crowd support",
        path: "M338 150 C316 164 282 176 246 170",
        startPoint: { x: "56%", y: "45%" },
        endPoint: { x: "48%", y: "50%" },
      },
    ],
  },
  {
    eventId: "evt-stadium-003",
    passengerImpact: "18,000",
    peakTime: "22:30-00:10",
    suggestedAction: "Add temporary route",
    affectedMetroStations: ["Koroğlu", "Gənclik", "28 May"],
    affectedBusRoutes: ["13", "38", "60", "93", "184"],
    congestionZones: [
      {
        id: "zone-stadium",
        label: "Stadium outbound wave",
        x: "82%",
        y: "28%",
        type: "congestion",
      },
      {
        id: "zone-genclik",
        label: "Gənclik transfer risk",
        x: "58%",
        y: "24%",
        type: "congestion",
      },
    ],
    crowdMarkers: [
      {
        id: "crowd-stadium-main",
        label: "Final whistle surge",
        x: "82%",
        y: "28%",
        type: "congestion",
      },
      {
        id: "crowd-genclik",
        label: "Bus queue growth",
        x: "58%",
        y: "24%",
        type: "congestion",
      },
    ],
    temporaryRoutes: [
      {
        id: "tmp-genclik-stadium",
        label: "Event Shuttle Route",
        from: "Gənclik",
        to: "Olympic Stadium",
        expectedActiveTime: "19:30-00:30",
        transportType: "bus",
        reason: "event crowd support",
        path: "M348 78 C414 74 462 88 506 92",
        startPoint: { x: "58%", y: "24%" },
        endPoint: { x: "82%", y: "28%" },
      },
      {
        id: "metro-koroglu-28may",
        label: "Extra Metro Support",
        from: "Koroğlu",
        to: "28 May",
        expectedActiveTime: "22:15-00:20",
        transportType: "metro",
        reason: "event crowd support",
        path: "M484 118 C452 132 426 124 395 122",
        startPoint: { x: "78%", y: "36%" },
        endPoint: { x: "66%", y: "38%" },
      },
    ],
  },
  {
    eventId: "evt-oldcity-004",
    passengerImpact: "2,400",
    peakTime: "20:30-21:45",
    suggestedAction: "Notify users",
    affectedMetroStations: ["İçərişəhər", "Sahil", "Nizami"],
    affectedBusRoutes: ["6", "18", "65", "88"],
    congestionZones: [
      {
        id: "zone-oldcity",
        label: "Old City pedestrian flow",
        x: "35%",
        y: "56%",
        type: "congestion",
      },
    ],
    crowdMarkers: [
      {
        id: "crowd-oldcity-main",
        label: "Gate exit cluster",
        x: "34%",
        y: "56%",
        type: "congestion",
      },
    ],
    temporaryRoutes: [
      {
        id: "tmp-oldcity-sahil",
        label: "New Temporary Bus Route",
        from: "İçərişəhər",
        to: "Sahil",
        expectedActiveTime: "20:00-22:00",
        transportType: "bus",
        reason: "event crowd support",
        path: "M190 190 C215 176 230 174 246 170",
        startPoint: { x: "35%", y: "56%" },
        endPoint: { x: "48%", y: "50%" },
      },
    ],
  },
];

export const azconFlowAIMockData = {
  iTicketEvents: mockITicketEvents,
  metroStations: mockMetroStations,
  busRoutes: mockBusRoutes,
  congestionLevels: mockCongestionLevels,
  alerts: mockTransportAlerts,
  routeSuggestions: mockRouteSuggestions,
  routePlannerOptions: mockRoutePlannerOptions,
  mobilityAlerts: mockMobilityAlerts,
  upcomingEventImpacts: mockUpcomingEventImpacts,
};
