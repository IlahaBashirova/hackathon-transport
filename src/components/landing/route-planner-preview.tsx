"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  BusFront,
  Car,
  CircleDollarSign,
  Clock3,
  Navigation,
  Route,
  TrainFront,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { RouteMap } from "@/components/landing/route-map";
import {
  CongestionRisk,
  mockRoutePlannerOptions,
  RoutePlannerMode,
  RoutePlannerOptionMock,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

type PlannerFilter = "fastest" | "cheapest" | "least-crowded";

const filterLabels: Array<{ id: PlannerFilter; label: string }> = [
  { id: "fastest", label: "planner.fastest" },
  { id: "cheapest", label: "planner.cheapest" },
  { id: "least-crowded", label: "planner.leastCrowded" },
];

const crowdScore: Record<CongestionRisk, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const riskStyles: Record<CongestionRisk, string> = {
  critical: "bg-red-950 text-red-100 ring-red-700/70",
  high: "bg-red-500/10 text-red-500 ring-red-400/40 dark:text-red-300",
  medium: "bg-yellow-400/10 text-yellow-700 ring-yellow-300/40 dark:text-yellow-200",
  low: "bg-emerald-300/10 text-emerald-700 ring-emerald-300/40 dark:text-emerald-200",
};

const modeIcons: Record<RoutePlannerMode, typeof TrainFront> = {
  "metro-only": TrainFront,
  "bus-only": BusFront,
  "metro-bus": Route,
  apara: Car,
  bolt: Car,
};

export function RoutePlannerPreview() {
  const { t } = useI18n();
  const [from, setFrom] = useState("Bakı Olimpiya Stadionu");
  const [to, setTo] = useState("28 May");
  const [filter, setFilter] = useState<PlannerFilter>("fastest");

  const routeOptions = useMemo(() => {
    const options = mockRoutePlannerOptions.map((option) => ({
      ...option,
      from,
      to,
    }));

    return options.sort((first, second) => {
      if (filter === "cheapest") {
        return first.estimatedCost - second.estimatedCost;
      }

      if (filter === "least-crowded") {
        return crowdScore[first.crowdLevel] - crowdScore[second.crowdLevel];
      }

      return first.estimatedTimeMinutes - second.estimatedTimeMinutes;
    });
  }, [filter, from, to]);

  const recommendedRoute = routeOptions[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-slate-950 dark:shadow-blue-950/30">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25 dark:bg-cyan-300 dark:text-slate-950">
            <Navigation size={20} />
          </span>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Route planner
            </p>
            <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Crowd-aware journey options
            </h3>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {t("planner.from")}
            </span>
            <input
              className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-cyan-300/60"
              onChange={(event) => setFrom(event.target.value)}
              value={from}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
              {t("planner.to")}
            </span>
            <input
              className="mt-2 h-12 w-full rounded-lg border border-cyan-300/40 bg-cyan-50 px-4 text-sm font-semibold text-slate-950 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:bg-cyan-300/10 dark:text-white"
              onChange={(event) => setTo(event.target.value)}
              value={to}
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filterLabels.map((item) => (
            <button
              className={`h-10 rounded-lg px-4 text-sm font-semibold transition ${
                filter === item.id
                  ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-cyan-300/50"
              }`}
              key={item.id}
              onClick={() => setFilter(item.id)}
              type="button"
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3">
          {routeOptions.map((option) => (
            <RouteOptionCard
              isRecommended={option.id === recommendedRoute.id}
              key={option.id}
              option={option}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        <RouteMap />
        <div className="grid gap-3 sm:grid-cols-3">
          <PlannerStat icon={Clock3} label="Best time" value={`${recommendedRoute.estimatedTimeMinutes} min`} />
          <PlannerStat icon={CircleDollarSign} label="Best cost" value={`${recommendedRoute.estimatedCost.toFixed(2)} AZN`} />
          <PlannerStat icon={UsersRound} label="Crowd level" value={recommendedRoute.crowdLevel} />
        </div>
      </div>
    </div>
  );
}

function RouteOptionCard({
  isRecommended,
  option,
}: {
  isRecommended: boolean;
  option: RoutePlannerOptionMock;
}) {
  const Icon = modeIcons[option.mode];

  return (
    <motion.article
      className={`rounded-lg border p-4 transition ${
        isRecommended
          ? "border-cyan-300/70 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-300/10"
          : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.04]"
      }`}
      whileHover={{ y: -4 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950">
            <Icon size={20} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-slate-950 dark:text-white">
                {option.title}
              </h4>
              {isRecommended ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-xs font-bold text-white dark:bg-cyan-300 dark:text-slate-950">
                  <BadgeCheck size={12} />
                  Recommended
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {option.from} → {option.to}
            </p>
          </div>
        </div>
        <span
          className={`w-fit rounded-lg px-2.5 py-1 text-xs font-bold uppercase ring-1 ${riskStyles[option.crowdLevel]}`}
        >
          {option.crowdLevel}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <MiniMetric icon={Clock3} label="Time" value={`${option.estimatedTimeMinutes} min`} />
        <MiniMetric icon={CircleDollarSign} label="Cost" value={`${option.estimatedCost.toFixed(2)} AZN`} />
        <MiniMetric icon={UsersRound} label="Crowd" value={option.crowdLevel} />
        <MiniMetric icon={Route} label="Type" value={option.transportType} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {option.steps.map((step) => (
          <span
            className="rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:ring-white/10"
            key={step}
          >
            {step}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/55">
      <Icon className="text-blue-600 dark:text-cyan-300" size={16} />
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function PlannerStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950 dark:shadow-blue-950/20"
      whileHover={{ y: -3 }}
    >
      <Icon className="text-blue-600 dark:text-cyan-300" size={18} />
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
    </motion.div>
  );
}
