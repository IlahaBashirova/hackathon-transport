"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BusFront,
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Route,
  Ticket,
  TrainFront,
  UsersRound,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CongestionRisk,
  mockITicketEvents,
  mockUpcomingEventImpacts,
  TemporaryRouteSolutionMock,
} from "@/lib/mock-data";

const riskStyles: Record<CongestionRisk, string> = {
  critical: "bg-red-500/10 text-red-500 ring-red-400/30 dark:text-red-300",
  high: "bg-amber-400/10 text-amber-600 ring-amber-300/30 dark:text-amber-200",
  medium: "bg-cyan-300/10 text-cyan-600 ring-cyan-300/30 dark:text-cyan-200",
  low: "bg-emerald-300/10 text-emerald-600 ring-emerald-300/30 dark:text-emerald-200",
};

export function UpcomingEventsImpact() {
  const [selectedEventId, setSelectedEventId] = useState(mockITicketEvents[0].id);

  const selectedEvent = useMemo(
    () =>
      mockITicketEvents.find((event) => event.id === selectedEventId) ??
      mockITicketEvents[0],
    [selectedEventId],
  );

  const selectedImpact = useMemo(
    () =>
      mockUpcomingEventImpacts.find(
        (impact) => impact.eventId === selectedEvent.id,
      ) ?? mockUpcomingEventImpacts[0],
    [selectedEvent.id],
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            Upcoming Events Impact
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
            Event demand becomes a new route solution.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Select an iTicket event to see predicted congestion zones, affected
            metro and BakuBus routes, and the temporary transport routes opened
            to support the crowd.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:shadow-blue-950/20">
          <span className="font-semibold text-slate-950 dark:text-white">
            Flow:
          </span>{" "}
          Event → predicted congestion → new route solution
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.35fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950 dark:shadow-blue-950/30">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
                Calendar
              </p>
              <h3 className="mt-1 text-2xl font-semibold">Upcoming events</h3>
            </div>
            <CalendarDays className="text-blue-600 dark:text-cyan-300" size={24} />
          </div>

          <div className="space-y-3">
            {mockITicketEvents.map((event) => {
              const impact = mockUpcomingEventImpacts.find(
                (item) => item.eventId === event.id,
              );
              const isSelected = event.id === selectedEvent.id;

              return (
                <motion.button
                  className={`w-full rounded-lg border p-4 text-left transition ${
                    isSelected
                      ? "border-cyan-300/70 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-300/10"
                      : "border-slate-200 bg-slate-50 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/40"
                  }`}
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  type="button"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex gap-3">
                    <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-950 px-2 py-3 text-white dark:bg-white dark:text-slate-950">
                      <span className="text-xs uppercase text-slate-300 dark:text-slate-500">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-2xl font-semibold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-950 dark:text-white">
                          {event.eventName}
                        </h4>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white dark:bg-cyan-300 dark:text-slate-950">
                          <Ticket size={12} />
                          iTicket
                        </span>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                        <span className="flex items-center gap-1">
                          <Clock3 size={14} />
                          {event.startTime}-{event.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.venue}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-white/10">
                          Impact {impact?.passengerImpact ?? "0"}
                        </span>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ring-1 ${riskStyles[event.congestionRisk]}`}
                        >
                          {event.congestionRisk}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <QuickActionButton icon={TrainFront} label="Open Metro Map" />
                        <QuickActionButton icon={BusFront} label="Open BakuBus Map" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg border border-sky-300/20 bg-slate-950 p-4 text-white shadow-2xl shadow-blue-950/30"
            exit={{ opacity: 0, x: 18 }}
            initial={{ opacity: 0, x: 18 }}
            key={selectedEvent.id}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Transport impact map
                </p>
                <h3 className="mt-2 text-3xl font-semibold">
                  {selectedEvent.eventName}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={15} />
                  {selectedEvent.venue}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <MapPill icon={TrainFront} label="Metro preview" />
                <MapPill icon={BusFront} label="BakuBus preview" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <PredictionCard
                icon={UsersRound}
                label="Expected crowd"
                value={selectedImpact.passengerImpact}
              />
              <PredictionCard
                icon={Clock3}
                label="Peak time"
                value={selectedImpact.peakTime}
              />
              <PredictionCard
                icon={Zap}
                label="Congestion risk"
                value={selectedEvent.congestionRisk}
              />
              <PredictionCard
                icon={Route}
                label="Suggested action"
                value={selectedImpact.suggestedAction}
              />
            </div>

            <ImpactMap eventName={selectedEvent.eventName} impact={selectedImpact} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

type IconComponent = typeof TrainFront;

function QuickActionButton({
  icon: Icon,
  label,
}: {
  icon: IconComponent;
  label: string;
}) {
  return (
    <span className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-300/50 dark:hover:text-cyan-200">
      <Icon size={14} />
      {label}
      <ExternalLink size={12} />
    </span>
  );
}

function MapPill({ icon: Icon, label }: { icon: IconComponent; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
      <Icon size={16} />
      {label}
    </span>
  );
}

function PredictionCard({
  icon: Icon,
  label,
  value,
}: {
  icon: IconComponent;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
      whileHover={{ y: -3, borderColor: "rgba(34,211,238,0.42)" }}
    >
      <Icon className="text-cyan-300" size={18} />
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-base font-semibold capitalize text-white">{value}</p>
    </motion.div>
  );
}

function ImpactMap({
  eventName,
  impact,
}: {
  eventName: string;
  impact: (typeof mockUpcomingEventImpacts)[number];
}) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="relative min-h-[470px] overflow-hidden rounded-lg border border-white/10 bg-[#020817]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_72%,rgba(239,68,68,0.2),transparent_18%),radial-gradient(circle_at_72%_32%,rgba(239,68,68,0.18),transparent_18%),radial-gradient(circle_at_58%_46%,rgba(34,211,238,0.12),transparent_32%)]" />

        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 620 340"
        >
          <path
            d="M90 245 C190 210 245 170 330 150 C410 132 462 116 535 92"
            fill="none"
            stroke="rgba(148,163,184,0.22)"
            strokeDasharray="8 10"
            strokeWidth="4"
          />
          <path
            d="M70 280 C145 250 250 240 360 210 C440 188 500 155 575 140"
            fill="none"
            stroke="rgba(59,130,246,0.22)"
            strokeDasharray="6 12"
            strokeWidth="4"
          />
          {impact.temporaryRoutes.map((route, index) => (
            <motion.path
              d={route.path}
              fill="none"
              initial={{ pathLength: 0, opacity: 0.4 }}
              key={route.id}
              stroke={index % 2 === 0 ? "#22d3ee" : "#3b82f6"}
              strokeLinecap="round"
              strokeWidth="6"
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              animate={{ pathLength: 1, opacity: 1 }}
              filter="drop-shadow(0 0 12px rgba(34,211,238,0.75))"
            />
          ))}
        </svg>

        {impact.congestionZones.map((zone) => (
          <motion.div
            className="absolute rounded-full border border-red-300/50 bg-red-500/20 shadow-[0_0_42px_rgba(239,68,68,0.45)]"
            key={zone.id}
            style={{
              left: zone.x,
              top: zone.y,
              height: 92,
              width: 92,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ opacity: [0.45, 0.86, 0.45], scale: [0.92, 1.08, 0.92] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400" />
          </motion.div>
        ))}

        {impact.crowdMarkers.map((marker) => (
          <motion.div
            className="absolute z-10"
            key={marker.id}
            style={{ left: marker.x, top: marker.y }}
            animate={{ scale: [1, 1.18, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="relative flex size-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
              <span className="relative inline-flex size-5 rounded-full border border-white bg-red-500 shadow-[0_0_22px_rgba(239,68,68,0.9)]" />
            </span>
          </motion.div>
        ))}

        {impact.temporaryRoutes.map((route) => (
          <RouteEndpoint key={`${route.id}-start`} point={route.startPoint} />
        ))}
        {impact.temporaryRoutes.map((route) => (
          <RouteEndpoint key={`${route.id}-end`} point={route.endPoint} />
        ))}

        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-slate-950/82 p-3 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Selected event
          </p>
          <p className="mt-1 max-w-52 text-sm font-semibold text-white">
            {eventName}
          </p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 grid gap-2 sm:grid-cols-2">
          <LegendItem color="bg-red-500" label="Predicted congestion areas" />
          <LegendItem color="bg-cyan-300" label="New added transport routes" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            New route solutions
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Cyan and blue lines show additional routes opened because of the
            selected event. Red is reserved only for congestion.
          </p>
        </div>

        {impact.temporaryRoutes.map((route) => (
          <TemporaryRouteCard key={route.id} route={route} />
        ))}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <AffectedList
            icon={TrainFront}
            label="Affected metro stations"
            values={impact.affectedMetroStations}
          />
          <AffectedList
            icon={BusFront}
            label="Affected BakuBus routes"
            values={impact.affectedBusRoutes.map((route) => `Route ${route}`)}
          />
        </div>
      </div>
    </div>
  );
}

function RouteEndpoint({ point }: { point: { x: string; y: string } }) {
  return (
    <motion.span
      className="absolute z-20 flex size-4 items-center justify-center rounded-full border border-white bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.95)]"
      style={{ left: point.x, top: point.y, transform: "translate(-50%, -50%)" }}
      animate={{ scale: [1, 1.35, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/76 px-3 py-2 text-xs text-slate-300 backdrop-blur">
      <span className={`size-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function TemporaryRouteCard({ route }: { route: TemporaryRouteSolutionMock }) {
  const Icon = route.transportType === "metro" ? TrainFront : BusFront;

  return (
    <motion.div
      className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-4"
      whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.62)" }}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.45)]">
          <Icon size={19} />
        </span>
        <div>
          <p className="text-sm font-semibold text-cyan-100">{route.label}</p>
          <h4 className="mt-1 text-lg font-semibold text-white">
            {route.from} → {route.to}
          </h4>
          <div className="mt-3 grid gap-2 text-xs text-slate-300">
            <span>Active: {route.expectedActiveTime}</span>
            <span className="capitalize">Transport: {route.transportType}</span>
            <span>Reason: {route.reason}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AffectedList({
  icon: Icon,
  label,
  values,
}: {
  icon: IconComponent;
  label: string;
  values: string[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
        <Icon className="text-cyan-300" size={17} />
        {label}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10"
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}
