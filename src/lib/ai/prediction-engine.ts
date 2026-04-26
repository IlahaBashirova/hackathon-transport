import { CongestionRisk } from "@/lib/mock-data";
import { EventCategory, PredictionEngineResult } from "@/lib/ai/types";

/**
 * Attendance rate by event category (how full venues typically get)
 */
const ATTENDANCE_RATES: Record<EventCategory, number> = {
  concert: 0.85,
  sport: 0.9,
  theatre: 0.75,
  expo: 0.65,
  conference: 0.7,
  other: 0.7,
  culture: 0.75, // legacy mapping
};

/**
 * Percentage of attendees who use public transport in Baku
 */
const PUBLIC_TRANSPORT_USAGE_RATE = 0.6;

/**
 * Metro vs Bus split for public transport users
 */
const METRO_SHARE = 0.65; // 65% take metro
const BUS_SHARE = 0.35; // 35% take bus

/**
 * Venue capacity estimates (fallback when no data available)
 */
const VENUE_CAPACITY_ESTIMATES: Record<string, number> = {
  "crystal hall": 25000,
  "baku crystal hall": 25000,
  "bakı crystal hall": 25000,
  "tofiq bahramov": 31800,
  "republic stadium": 30000,
  "heydar aliyev center": 1000,
  "heydər əliyev mərkəzi": 1000,
  "müslüm maqomayev": 1700,
  "azadlıq": 5000,
  "dinamo": 5000,
  "ganclik": 500,
  "gənclik": 500,
  "28 may": 800,
  "nerimanov": 400,
  "nərimanov": 400,
};

/**
 * Calculate expected attendance based on available data
 */
function calculateExpectedAttendance(
  ticketCapacity: number | null,
  estimatedAttendance: number | null,
  category: EventCategory,
  venue: string,
): { attendance: number; isBasedOnRealCapacity: boolean; confidence: number } {
  // Priority 1: Real ticket capacity
  if (ticketCapacity && ticketCapacity > 0) {
    const attendanceRate = ATTENDANCE_RATES[category] || 0.7;
    const attendance = Math.round(ticketCapacity * attendanceRate);
    return {
      attendance,
      isBasedOnRealCapacity: true,
      confidence: 0.85,
    };
  }

  // Priority 2: Explicit estimated attendance
  if (estimatedAttendance && estimatedAttendance > 0) {
    return {
      attendance: estimatedAttendance,
      isBasedOnRealCapacity: false,
      confidence: 0.65,
    };
  }

  // Priority 3: Estimate from venue
  const venueLower = venue.toLowerCase();
  const matchingVenue = Object.keys(VENUE_CAPACITY_ESTIMATES).find((v) =>
    venueLower.includes(v),
  );

  if (matchingVenue) {
    const venueCapacity = VENUE_CAPACITY_ESTIMATES[matchingVenue];
    const attendanceRate = ATTENDANCE_RATES[category] || 0.7;
    const attendance = Math.round(venueCapacity * attendanceRate);
    return {
      attendance,
      isBasedOnRealCapacity: false,
      confidence: 0.45,
    };
  }

  // Fallback: Safe default based on category
  const defaultAttendance = category === "concert" || category === "sport" ? 8000 : 2000;
  return {
    attendance: defaultAttendance,
    isBasedOnRealCapacity: false,
    confidence: 0.3,
  };
}

/**
 * Calculate congestion risk level from scores
 */
function calculateCongestionRisk(
  metroCongestionScore: number,
  busCongestionScore: number,
): CongestionRisk {
  const maxScore = Math.max(metroCongestionScore, busCongestionScore);

  if (maxScore >= 85) return "critical";
  if (maxScore >= 65) return "high";
  if (maxScore >= 40) return "medium";
  return "low";
}

/**
 * Calculate peak time windows based on event timing
 */
function calculatePeakWindows(
  date: string | null,
  startTime: string | null,
  endTime: string | null,
): { peakArrivalWindow: string; peakExitWindow: string } {
  // Default windows if no timing data
  if (!startTime || !endTime) {
    return {
      peakArrivalWindow: "18:00-19:30",
      peakExitWindow: "22:00-23:30",
    };
  }

  // Parse start time
  const [startHour, startMin] = startTime.split(":").map(Number);
  const startMinutes = startHour * 60 + (startMin || 0);

  // Parse end time
  const [endHour, endMin] = endTime.split(":").map(Number);
  const endMinutes = endHour * 60 + (endMin || 0);

  // Arrival window: 60-90 min before start
  const arrivalStart = startMinutes - 90;
  const arrivalEnd = startMinutes - 30;

  // Exit window: 0-60 min after end
  const exitStart = endMinutes;
  const exitEnd = endMinutes + 60;

  // Format helper
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  return {
    peakArrivalWindow: `${formatTime(arrivalStart)}-${formatTime(arrivalEnd)}`,
    peakExitWindow: `${formatTime(exitStart)}-${formatTime(exitEnd)}`,
  };
}

/**
 * Main prediction engine function
 * Calculates congestion predictions from extracted event data
 */
export function calculateTransportImpact(options: {
  ticketCapacity: number | null;
  estimatedAttendance: number | null;
  category: EventCategory;
  venue: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  nearestMetroStations: string[];
  nearbyBusRoutes: string[];
  extractionConfidence: number;
}): PredictionEngineResult {
  // Step 1: Calculate expected attendance
  const { attendance, isBasedOnRealCapacity, confidence: attendanceConfidence } =
    calculateExpectedAttendance(
      options.ticketCapacity,
      options.estimatedAttendance,
      options.category,
      options.venue,
    );

  // Step 2: Calculate public transport passengers
  const expectedPublicTransportPassengers = Math.round(
    attendance * PUBLIC_TRANSPORT_USAGE_RATE,
  );

  // Step 3: Split between metro and bus
  const metroPassengers = Math.round(expectedPublicTransportPassengers * METRO_SHARE);
  const busPassengers = Math.round(expectedPublicTransportPassengers * BUS_SHARE);

  // Step 4: Calculate congestion scores (0-100)
  // Base score from passenger volume
  const baseMetroScore = Math.min(40 + Math.floor(metroPassengers / 200), 70);
  const baseBusScore = Math.min(30 + Math.floor(busPassengers / 150), 65);

  // Boost for venue proximity (more stations = distributed load = lower score per station)
  const metroStationCount = options.nearestMetroStations.length || 1;
  const busRouteCount = options.nearbyBusRoutes.length || 1;

  const metroVenueFactor = metroStationCount > 2 ? -10 : metroStationCount > 1 ? -5 : 5;
  const busVenueFactor = busRouteCount > 2 ? -8 : busRouteCount > 1 ? -4 : 3;

  // Category factor (sport/concert have more concentrated exit waves)
  const categoryFactor =
    options.category === "sport" || options.category === "concert" ? 10 : 0;

  const metroCongestionScore = Math.min(
    100,
    Math.max(0, baseMetroScore + metroVenueFactor + categoryFactor),
  );
  const busCongestionScore = Math.min(
    100,
    Math.max(0, baseBusScore + busVenueFactor + categoryFactor),
  );

  // Step 5: Determine risk level
  const congestionRisk = calculateCongestionRisk(metroCongestionScore, busCongestionScore);

  // Step 6: Calculate peak windows
  const { peakArrivalWindow, peakExitWindow } = calculatePeakWindows(
    options.date,
    options.startTime,
    options.endTime,
  );

  // Step 7: Format passenger impact string
  const passengerImpact = expectedPublicTransportPassengers.toLocaleString();

  // Step 8: Overall confidence
  const overallConfidence = Math.round((attendanceConfidence * options.extractionConfidence) * 100) / 100;

  return {
    congestionRisk,
    passengerImpact,
    peakTime: peakExitWindow, // Legacy field, use exit window as peak
    confidence: overallConfidence,
    expectedAttendance: attendance,
    expectedPublicTransportPassengers,
    metroPassengers,
    busPassengers,
    metroCongestionScore,
    busCongestionScore,
    peakArrivalWindow,
    peakExitWindow,
    isBasedOnRealCapacity,
  };
}

/**
 * Generate recommended actions based on prediction results
 */
export function generateRecommendedActions(
  congestionRisk: CongestionRisk,
  metroScore: number,
  busScore: number,
): string[] {
  const actions: string[] = [];

  if (congestionRisk === "critical" || congestionRisk === "high") {
    actions.push("Reduce metro interval to 2-3 minutes");
    actions.push("Deploy additional staff at stations");
    actions.push("Activate crowd control barriers");
  }

  if (metroScore > 60) {
    actions.push("Add temporary shuttle bus routes");
    actions.push("Redirect passengers to alternative stations");
  }

  if (busScore > 50) {
    actions.push("Increase bus frequency on affected routes");
    actions.push("Extend bus operating hours");
  }

  if (congestionRisk === "medium") {
    actions.push("Monitor station capacity in real-time");
    actions.push("Prepare standby protocols");
  }

  actions.push("Notify users via app and station displays");
  actions.push("Coordinate with traffic police");

  return actions.slice(0, 5); // Return top 5 actions
}
