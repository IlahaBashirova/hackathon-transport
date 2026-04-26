"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BellRing,
  BusFront,
  Clock3,
  MapPin,
  Route,
  TrainFront,
  UsersRound,
} from "lucide-react";
import { ReactNode } from "react";
import { useMemo } from "react";
import { ProcessedEventImpact } from "@/components/landing/import-iticket-event";
import {
  DashboardPredictionState,
  getDashboardPredictionState,
} from "@/lib/prediction-engine";
import { CongestionRisk } from "@/lib/mock-data";

const PassengerLoadChart = dynamic(
  () =>
    import("@/components/landing/live-dashboard-charts").then(
      (module) => module.PassengerLoadChart,
    ),
  { ssr: false },
);
const StationRiskChart = dynamic(
  () =>
    import("@/components/landing/live-dashboard-charts").then(
      (module) => module.StationRiskChart,
    ),
  { ssr: false },
);
const EventImpactComparisonChart = dynamic(
  () =>
    import("@/components/landing/live-dashboard-charts").then(
      (module) => module.EventImpactComparisonChart,
    ),
  { ssr: false },
);

const riskTone: Record<CongestionRisk, string> = {
  critical: "bg-red-950/80 text-red-100 ring-red-700/70",
  high: "bg-red-500/10 text-red-300 ring-red-400/40",
  medium: "bg-yellow-400/10 text-yellow-200 ring-yellow-300/40",
  low: "bg-emerald-300/10 text-emerald-200 ring-emerald-300/30",
};

const riskDot: Record<CongestionRisk, string> = {
  critical: "bg-red-950 shadow-[0_0_24px_rgba(127,29,29,0.95)]",
  high: "bg-red-500 shadow-[0_0_22px_rgba(239,68,68,0.8)]",
  medium: "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.7)]",
  low: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]",
};

const metricTone = {
  danger: "from-red-500/20 to-red-500/5 text-red-200",
  normal: "from-emerald-400/20 to-emerald-400/5 text-emerald-200",
  solution: "from-cyan-300/20 to-blue-500/10 text-cyan-100",
  warning: "from-amber-400/20 to-amber-400/5 text-amber-100",
};

export function LiveMobilityDashboard({
  processedEvent,
}: {
  processedEvent: ProcessedEventImpact | null;
}) {
  const state = useMemo(
    () => getDashboardPredictionState(processedEvent),
    [processedEvent],
  );

  return (
    <div className="rounded-lg border border-sky-300/20 bg-slate-950 p-4 text-white shadow-2xl shadow-blue-950/30 sm:p-5">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm text-sky-200/70">Live mobility dashboard</p>
          <h3 className="mt-1 text-3xl font-semibold tracking-normal">
            {state.selectedEventName}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <MapPin size={15} />
            {state.selectedVenue}
          </p>
        </div>
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 rgba(34,211,238,0)",
              "0 0 30px rgba(34,211,238,0.35)",
              "0 0 0 rgba(34,211,238,0)",
            ],
          }}
          className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-200"
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Activity size={24} />
        </motion.div>
      </div>

      <NetworkOverview state={state} />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <LiveMapPreview state={state} />
        <div className="grid gap-4">
          <StationCards state={state} />
          <IntervalAdjustmentCards state={state} />
          <StatusTable title="Metro Station Status" icon={TrainFront}>
            {state.metroStatuses.map((station) => (
              <tr className="border-t border-white/10" key={station.stationName}>
                <td className="py-3 pr-3 font-medium text-white">{station.stationName}</td>
                <td className="py-3 pr-3">
                  <RiskBadge risk={station.congestionLevel} />
                </td>
                <td className="py-3 pr-3 text-slate-300">{station.expectedPassengerLoad}%</td>
                <td className="py-3 pr-3 text-slate-400">{station.affectedEvent}</td>
                <td className="py-3 text-slate-300">{station.suggestedAction}</td>
              </tr>
            ))}
          </StatusTable>

          <StatusTable title="BakuBus Route Status" icon={BusFront}>
            {state.busRouteStatuses.map((route) => (
              <tr className="border-t border-white/10" key={route.routeNumber}>
                <td className="py-3 pr-3 font-medium text-white">Route {route.routeNumber}</td>
                <td className="py-3 pr-3 text-slate-300">{route.currentStatus}</td>
                <td className="py-3 pr-3">
                  <RiskBadge risk={route.congestionImpact} />
                </td>
                <td className="py-3 text-slate-300">{route.recommendedAdjustment}</td>
              </tr>
            ))}
          </StatusTable>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <ChartCard title="Passenger load by time">
          <PassengerLoadChart data={state.passengerLoadByTime} />
        </ChartCard>
        <ChartCard title="Congestion risk by station">
          <StationRiskChart data={state.congestionRiskByStation} />
        </ChartCard>
        <ChartCard title="Event impact comparison">
          <EventImpactComparisonChart data={state.eventImpactComparison} />
        </ChartCard>
      </div>
    </div>
  );
}

function StationCards({ state }: { state: DashboardPredictionState }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {state.metroStatuses.slice(0, 4).map((station) => (
        <motion.div
          className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
          key={station.stationName}
          whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.42)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Metro station</p>
              <h4 className="mt-1 font-semibold text-white">
                {station.stationName}
              </h4>
            </div>
            <span className={`size-3 rounded-full ${riskDot[station.congestionLevel]}`} />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={`h-full rounded-full ${riskDot[station.congestionLevel]}`}
              initial={{ width: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              whileInView={{ width: `${station.expectedPassengerLoad}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Expected load</span>
            <span className="font-semibold text-slate-100">
              {station.expectedPassengerLoad}%
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function IntervalAdjustmentCards({ state }: { state: DashboardPredictionState }) {
  const affectedStations = state.metroStatuses
    .filter((station) => station.congestionLevel !== "low")
    .slice(0, 3);

  return (
    <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock3 className="text-cyan-300" size={19} />
        <h4 className="font-semibold text-white">Interval adjustments</h4>
      </div>
      <div className="grid gap-3">
        {affectedStations.map((station) => (
          <motion.div
            className="rounded-lg border border-white/10 bg-slate-950/55 p-3"
            key={station.stationName}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-100">
                  {station.stationName}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {station.suggestedAction}
                </p>
              </div>
              <span className="rounded-lg bg-cyan-300 px-2.5 py-1 text-xs font-bold text-slate-950">
                {station.congestionLevel === "critical"
                  ? "2.5 min"
                  : station.congestionLevel === "high"
                    ? "3.5 min"
                    : "5 min"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NetworkOverview({ state }: { state: DashboardPredictionState }) {
  const icons = [Activity, UsersRound, AlertTriangle, Route, BellRing];

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {state.overviewMetrics.map((metric, index) => {
        const Icon = icons[index] ?? Activity;

        return (
          <motion.div
            className={`rounded-lg border border-white/10 bg-gradient-to-br p-4 ${metricTone[metric.tone]}`}
            key={metric.label}
            whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.45)" }}
          >
            <Icon size={20} />
            <p className="mt-5 text-xs text-slate-400">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{metric.value}</p>
            <p className="mt-1 text-xs text-slate-400">{metric.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function LiveMapPreview({ state }: { state: DashboardPredictionState }) {
  return (
    <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/10 bg-[#020817]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <motion.div
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.02, 1] }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_24%_72%,rgba(127,29,29,0.48),transparent_18%),radial-gradient(circle_at_72%_32%,rgba(239,68,68,0.34),transparent_18%),radial-gradient(circle_at_52%_50%,rgba(250,204,21,0.18),transparent_20%),radial-gradient(circle_at_58%_46%,rgba(34,211,238,0.12),transparent_32%)]"
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 620 380"
      >
        <path
          d="M88 278 C190 236 245 194 330 166 C410 142 462 128 535 96"
          fill="none"
          stroke="rgba(148,163,184,0.26)"
          strokeDasharray="8 10"
          strokeWidth="4"
        />
        <path
          d="M70 310 C145 278 250 260 360 228 C440 206 500 175 575 156"
          fill="none"
          stroke="rgba(59,130,246,0.36)"
          strokeDasharray="6 12"
          strokeWidth="5"
        />
        <path
          d="M112 310 C186 292 248 286 338 256 C430 226 485 210 562 190"
          fill="none"
          stroke="rgba(34,211,238,0.24)"
          strokeDasharray="4 10"
          strokeWidth="4"
        />
        {state.temporaryRoutes.map((route, index) => (
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            d={route.path}
            fill="none"
            filter="drop-shadow(0 0 14px rgba(34,211,238,0.85))"
            initial={{ pathLength: 0, opacity: 0.25 }}
            key={route.id}
            stroke={index % 2 === 0 ? "#22d3ee" : "#3b82f6"}
            strokeLinecap="round"
            strokeWidth="7"
            transition={{
              duration: 1.9,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {state.selectedImpact.congestionZones.map((zone) => (
        <motion.div
          animate={{ opacity: [0.42, 0.9, 0.42], scale: [0.92, 1.1, 0.92] }}
          className="absolute rounded-full border border-red-300/50 bg-red-500/20 shadow-[0_0_44px_rgba(239,68,68,0.48)]"
          key={zone.id}
          style={{
            height: 98,
            left: zone.x,
            top: zone.y,
            transform: "translate(-50%, -50%)",
            width: 98,
          }}
          transition={{ duration: 2.15, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400" />
        </motion.div>
      ))}

      {state.metroStatuses.map((station, index) => (
        <MapStation key={station.stationName} index={index} station={station} />
      ))}

      {state.temporaryRoutes.map((route) => (
        <RouteEndpoint key={`${route.id}-start`} point={route.startPoint} />
      ))}
      {state.temporaryRoutes.map((route) => (
        <RouteEndpoint key={`${route.id}-end`} point={route.endPoint} />
      ))}

      <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-slate-950/82 p-3 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          Live map preview
        </p>
        <p className="mt-1 text-sm text-emerald-300">Green = normal</p>
        <p className="text-sm text-yellow-200">Yellow = medium</p>
        <p className="text-sm text-red-300">Red / dark red = high or critical</p>
        <p className="text-sm text-cyan-200">Blue/Cyan = solution routes</p>
      </div>
    </div>
  );
}

const stationPositions = [
  { x: "48%", y: "52%" },
  { x: "66%", y: "38%" },
  { x: "35%", y: "58%" },
  { x: "58%", y: "24%" },
  { x: "44%", y: "42%" },
];

function MapStation({
  index,
  station,
}: {
  index: number;
  station: DashboardPredictionState["metroStatuses"][number];
}) {
  const point = stationPositions[index] ?? stationPositions[0];
  const color =
    station.congestionLevel === "critical"
      ? "bg-red-950"
      : station.congestionLevel === "high"
        ? "bg-red-500"
        : station.congestionLevel === "medium"
          ? "bg-yellow-400"
          : "bg-emerald-400";

  return (
    <motion.div
      animate={{ scale: station.congestionLevel === "low" ? 1 : [1, 1.22, 1] }}
      className="absolute z-20"
      style={{ left: point.x, top: point.y }}
      transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className={`block size-4 rounded-full border border-white shadow-lg ${color}`} />
      <span className="mt-2 block rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1 text-xs text-slate-200 backdrop-blur">
        {station.stationName}
      </span>
    </motion.div>
  );
}

function RouteEndpoint({ point }: { point: { x: string; y: string } }) {
  return (
    <motion.span
      animate={{ scale: [1, 1.35, 1] }}
      className="absolute z-20 flex size-4 items-center justify-center rounded-full border border-white bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.95)]"
      style={{ left: point.x, top: point.y, transform: "translate(-50%, -50%)" }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function StatusTable({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: typeof TrainFront;
  title: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      <div className="flex items-center gap-2 border-b border-white/10 p-4">
        <Icon className="text-cyan-300" size={19} />
        <h4 className="font-semibold text-white">{title}</h4>
      </div>
      <div className="overflow-x-auto px-4">
        <table className="w-full min-w-[680px] text-left text-sm">
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: CongestionRisk }) {
  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase ring-1 ${riskTone[risk]}`}
    >
      {risk}
    </span>
  );
}

function ChartCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h4 className="font-semibold text-white">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}
