"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BusFront,
  CalendarDays,
  Clock3,
  Footprints,
  MapPin,
  Navigation,
  Route,
  Sparkles,
  TrainFront,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CongestionRisk,
  ITicketEventMock,
  mockBusRoutes,
  mockITicketEvents,
  mockMetroStations,
  mockUpcomingEventImpacts,
  UpcomingEventImpactMock,
} from "@/lib/mock-data";

const riskStyles: Record<CongestionRisk, string> = {
  critical: "border-red-400/40 bg-red-500/10 text-red-300",
  high: "border-red-400/35 bg-red-500/10 text-red-200",
  medium: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  low: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
};

const riskDotStyles: Record<CongestionRisk, string> = {
  critical: "bg-red-950 ring-red-400 shadow-[0_0_30px_rgba(127,29,29,0.95)]",
  high: "bg-red-500 ring-red-300 shadow-[0_0_28px_rgba(239,68,68,0.78)]",
  medium: "bg-amber-300 ring-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.7)]",
  low: "bg-emerald-400 ring-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.55)]",
};

const stationPositions: Record<string, { x: string; y: string }> = {
  Sahil: { x: "48%", y: "52%" },
  "28 May": { x: "66%", y: "38%" },
  "İçərişəhər": { x: "34%", y: "58%" },
  "Gənclik": { x: "73%", y: "24%" },
  Nizami: { x: "51%", y: "42%" },
  "Koroğlu": { x: "86%", y: "23%" },
};

const venuePositions: Record<string, { x: string; y: string }> = {
  "Baku Crystal Hall": { x: "22%", y: "74%" },
  "Heydər Əliyev Sarayı": { x: "56%", y: "45%" },
  "Bakı Olimpiya Stadionu": { x: "86%", y: "27%" },
  "İçərişəhər Open Air Stage": { x: "33%", y: "60%" },
};

function riskScore(risk: CongestionRisk) {
  return { critical: 96, high: 82, medium: 58, low: 28 }[risk];
}

function timeMinus(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = (hours * 60 + mins - minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60,
  ).padStart(2, "0")}`;
}

function findImpact(eventId: string) {
  return (
    mockUpcomingEventImpacts.find((impact) => impact.eventId === eventId) ??
    mockUpcomingEventImpacts[0]
  );
}

function getEventModel(event: ITicketEventMock, impact: UpcomingEventImpactMock) {
  const affectedStations = mockMetroStations.filter((station) =>
    impact.affectedMetroStations.includes(station.name),
  );
  const affectedRoutes = mockBusRoutes.filter((route) =>
    impact.affectedBusRoutes.includes(route.routeNumber),
  );
  const metroScore = Math.round(
    affectedStations.reduce((total, station) => total + station.projectedLoad, 0) /
      Math.max(affectedStations.length, 1),
  );
  const busScore = Math.min(
    100,
    Math.round(
      affectedRoutes.reduce(
        (total, route) =>
          total + riskScore(route.congestionRisk) + route.recommendedExtraBuses * 2,
        0,
      ) / Math.max(affectedRoutes.length, 1),
    ),
  );
  const walkingDistance =
    event.venue.includes("Crystal") || event.venue.includes("Olimpiya")
      ? "900 m"
      : "450 m";
  const estimatedTravelTime = Math.round(
    18 + Math.max(metroScore, busScore) * 0.18 + event.estimatedAttendance / 5200,
  );
  const recommendedRoute =
    metroScore > 84
      ? `Use ${impact.temporaryRoutes[0]?.from ?? event.nearestMetroStations[0]} temporary shuttle to ${event.venue}.`
      : `Use ${event.nearestMetroStations[0]} metro, then continue by marked BakuBus connection.`;
  const leastCrowded =
    metroScore > busScore
      ? `Choose BakuBus routes ${impact.affectedBusRoutes.slice(0, 2).join(", ")} after the first exit wave.`
      : `Use ${event.nearestMetroStations.at(-1)} station to avoid the busiest transfer point.`;

  return {
    affectedRoutes,
    affectedStations,
    busScore,
    cheapestRoute: `Metro plus BakuBus connection, about 1.10 AZN.`,
    estimatedTravelTime,
    fastestRoute: `Fastest: ${event.nearestMetroStations[0]} metro with temporary support bus.`,
    leastCrowded,
    metroScore,
    recommendedRoute,
    walkingDistance,
  };
}

export function ITicketSmartIntegration() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent =
    mockITicketEvents.find((event) => event.id === selectedEventId) ??
    null;
  const selectedImpact = selectedEvent ? findImpact(selectedEvent.id) : null;
  const eventModel = useMemo(
    () => selectedEvent && selectedImpact ? getEventModel(selectedEvent, selectedImpact) : null,
    [selectedEvent, selectedImpact],
  );

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToList = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-cyan-300/20 bg-slate-950 p-4 text-white shadow-2xl shadow-blue-950/40 sm:p-6 lg:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(37,99,235,0.22),transparent_30%)]" />
      <motion.div
        animate={{ x: ["-40%", "40%"], opacity: [0.08, 0.5, 0.08] }}
        className="absolute left-0 top-24 h-px w-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative">
        {!selectedEvent ? (
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
              initial={{ opacity: 0, y: 24 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Upcoming events
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">Event list</h3>
                </div>
                <CalendarDays className="text-cyan-300" size={26} />
              </div>

              <div className="space-y-3">
                {mockITicketEvents.map((event, index) => (
                  <motion.article
                    className="rounded-lg border border-white/10 bg-slate-900/86 p-4 shadow-lg shadow-slate-950/30 transition hover:border-cyan-300/45 cursor-pointer"
                    initial={{ opacity: 0, y: 18 }}
                    key={event.id}
                    transition={{ delay: index * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-white">
                          {event.eventName}
                        </h4>
                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
                          <MapPin size={14} />
                          {event.venue}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-bold uppercase ${riskStyles[event.congestionRisk]}`}
                      >
                        {event.congestionRisk}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="text-cyan-300" size={15} />
                        {event.date} · {event.startTime}
                      </span>
                      <span className="flex items-center gap-2">
                        <UsersRound className="text-cyan-300" size={15} />
                        {event.estimatedAttendance.toLocaleString()} expected
                      </span>
                    </div>

                    <div className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-4 text-sm font-semibold text-cyan-100 ring-1 ring-white/10">
                      Click to view details
                      <ArrowRight size={16} />
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-5"
              exit={{ opacity: 0, y: -18 }}
              initial={{ opacity: 0, y: 18 }}
              key={selectedEvent.id}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <button
                onClick={handleBackToList}
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition w-fit"
              >
                <ArrowRight className="rotate-180" size={16} />
                Back to events
              </button>
              <EventDetailPanel
                event={selectedEvent}
                eventModel={eventModel!}
                impact={selectedImpact!}
              />
              <ActualEventMap event={selectedEvent} />
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}

function EventDetailPanel({
  event,
  eventModel,
  impact,
}: {
  event: ITicketEventMock;
  eventModel: ReturnType<typeof getEventModel>;
  impact: UpcomingEventImpactMock;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-900/82 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Event detail
            </p>
            <h3 className="mt-2 text-3xl font-semibold tracking-normal">
              {event.eventName}
            </h3>
            <p className="mt-2 flex items-center gap-2 text-slate-300">
              <MapPin className="text-cyan-300" size={17} />
              {event.venue}
            </p>
          </div>
          <span
            className={`w-fit rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${riskStyles[event.congestionRisk]}`}
          >
            {event.congestionRisk} risk
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoTile icon={UsersRound} label="Predicted crowd" value={event.estimatedAttendance.toLocaleString()} />
          <InfoTile icon={Clock3} label="Peak arrival" value={`${timeMinus(event.startTime, 75)}-${event.startTime}`} />
          <InfoTile icon={Clock3} label="Peak exit" value={impact.peakTime} />
          <InfoTile icon={Footprints} label="Walking distance" value={eventModel.walkingDistance} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <ChipList
            icon={TrainFront}
            label="Nearby metro"
            values={impact.affectedMetroStations}
          />
          <ChipList
            icon={BusFront}
            label="Nearby BakuBus"
            values={impact.affectedBusRoutes.map((route) => `Route ${route}`)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-2xl shadow-cyan-950/25">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Best user route
            </p>
            <h3 className="mt-2 text-2xl font-semibold">
              Recommended: Metro + temporary support
            </h3>
          </div>
          <Sparkles className="text-cyan-200" size={27} />
        </div>

        <p className="mt-4 text-lg leading-8 text-white">
          {eventModel.recommendedRoute}
        </p>

        <div className="mt-5 grid gap-3">
          <RecommendationRow icon={Zap} label="Fastest route" value={eventModel.fastestRoute} />
          <RecommendationRow icon={Navigation} label="Least crowded route" value={eventModel.leastCrowded} />
          <RecommendationRow icon={Route} label="Cheapest route" value={eventModel.cheapestRoute} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ScoreCard icon={TrainFront} label="Metro load" score={eventModel.metroScore} />
          <ScoreCard icon={BusFront} label="Bus load" score={eventModel.busScore} />
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/55 p-4">
          <p className="text-sm font-semibold text-cyan-100">
            Recommended transport action
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {impact.suggestedAction}: open {impact.temporaryRoutes[0]?.label.toLowerCase() ?? "temporary support"} from{" "}
            {impact.temporaryRoutes[0]?.from ?? event.nearestMetroStations[0]} to{" "}
            {impact.temporaryRoutes[0]?.to ?? event.venue}.
          </p>
        </div>
      </div>
    </div>
  );
}

function ActualEventMap({
  event,
}: {
  event: ITicketEventMock;
}) {
  const { lat, lng } = event.coordinates;
  const zoom = 15;
  
  // Calculate bounding box for OpenStreetMap (roughly 0.02 degrees around the point)
  const minLat = lat - 0.02;
  const maxLat = lat + 0.02;
  const minLng = lng - 0.02;
  const maxLng = lng + 0.02;
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-900/88 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Event Location
          </p>
          <h3 className="mt-1 text-2xl font-semibold">{event.venue}</h3>
        </div>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition"
        >
          View larger map →
        </a>
      </div>

      <div className="relative">
        <iframe
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className="bg-slate-800"
          title={`Map of ${event.venue}`}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/90 border-t border-white/10 p-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="text-cyan-300" size={16} />
              <span className="text-slate-300">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="hidden sm:flex items-center gap-2">
              <Navigation className="text-cyan-300" size={16} />
              <span className="text-slate-300">Baku, Azerbaijan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <Icon className="text-cyan-300" size={17} />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

function ChipList({
  icon: Icon,
  label,
  values,
}: {
  icon: LucideIcon;
  label: string;
  values: string[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
        <Icon size={17} />
        {label}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-medium text-cyan-100"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecommendationRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300 text-slate-950">
          <Icon size={17} />
        </span>
        <div>
          <p className="text-sm font-semibold text-cyan-100">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  icon: Icon,
  label,
  score,
}: {
  icon: LucideIcon;
  label: string;
  score: number;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Icon className="text-cyan-300" size={18} />
          {label}
        </div>
        <span className="text-xl font-semibold">{score}/100</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={{ width: `${score}%` }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
          initial={{ width: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-slate-300">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function MapLabel({ className, label }: { className: string; label: string }) {
  return (
    <span
      className={`absolute rounded bg-slate-950/50 px-2 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-white/10 ${className}`}
    >
      {label}
    </span>
  );
}

function MapMarker({
  label,
  risk,
  x,
  y,
}: {
  label: string;
  risk: CongestionRisk;
  x: string;
  y: string;
}) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <motion.span
        animate={{ scale: [1, 1.45, 1], opacity: [0.75, 0.18, 0.75] }}
        className={`absolute inset-0 size-8 rounded-full ${riskDotStyles[risk]}`}
        transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className={`relative block size-4 rounded-full ring-4 ${riskDotStyles[risk]}`}
      />
      <span className="absolute left-4 top-4 whitespace-nowrap rounded bg-slate-950/72 px-2 py-1 text-[11px] font-semibold text-slate-200 ring-1 ring-white/10">
        {label}
      </span>
    </div>
  );
}
