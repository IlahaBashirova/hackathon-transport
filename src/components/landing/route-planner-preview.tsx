"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  BusFront,
  Car,
  CircleDollarSign,
  Clock3,
  MapPin,
  Navigation,
  Route,
  Star,
  TrainFront,
  UsersRound,
  Zap,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CongestionRisk,
  mockRoutePlannerOptions,
  mockMetroStations,
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

const crowdLabels: Record<CongestionRisk, string> = {
  critical: "Çox sıx",
  high: "Sıx",
  medium: "Orta",
  low: "Aşağı",
};

const crowdColors: Record<CongestionRisk, string> = {
  critical: "text-red-400 bg-red-500/10 border-red-400/30",
  high: "text-amber-400 bg-amber-500/10 border-amber-400/30",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-400/30",
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-400/30",
};

const modeIcons: Record<RoutePlannerMode, typeof TrainFront> = {
  "metro-only": TrainFront,
  "bus-only": BusFront,
  "metro-bus": Route,
  apara: Car,
  bolt: Car,
};

const modeLabels: Record<RoutePlannerMode, string> = {
  "metro-only": "Metro",
  "bus-only": "BakuBus",
  "metro-bus": "Metro + Bus",
  apara: "Apar",
  bolt: "Bolt",
};

// Get badge for route based on its ranking
function getRouteBadge(
  option: RoutePlannerOptionMock,
  allOptions: RoutePlannerOptionMock[],
  isRecommended: boolean,
): { type: string; label: string; icon: typeof Star } | null {
  if (isRecommended) return { type: "recommended", label: "Tövsiyə olunan", icon: Star };
  
  // Check if fastest (not already recommended)
  const fastest = [...allOptions].sort((a, b) => a.estimatedTimeMinutes - b.estimatedTimeMinutes)[0];
  if (option.id === fastest.id && !isRecommended) {
    return { type: "fastest", label: "Ən sürətli", icon: Zap };
  }
  
  // Check if cheapest
  const cheapest = [...allOptions].sort((a, b) => a.estimatedCost - b.estimatedCost)[0];
  if (option.id === cheapest.id && !isRecommended) {
    return { type: "cheapest", label: "Ən ucuz", icon: CircleDollarSign };
  }
  
  // Check if least crowded
  const leastCrowded = [...allOptions].sort((a, b) => crowdScore[a.crowdLevel] - crowdScore[b.crowdLevel])[0];
  if (option.id === leastCrowded.id && !isRecommended) {
    return { type: "least-crowded", label: "Ən az sıx", icon: UsersRound };
  }
  
  return null;
}

export function RoutePlannerPreview() {
  const { t } = useI18n();
  const [from, setFrom] = useState("Bakı Olimpiya Stadionu");
  const [to, setTo] = useState("28 May");
  const [filter, setFilter] = useState<PlannerFilter>("fastest");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

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
  const activeRoute = selectedRouteId 
    ? routeOptions.find(r => r.id === selectedRouteId) || recommendedRoute 
    : recommendedRoute;

  // Find avoided station (the most congested one that's NOT on the recommended route)
  const avoidedStation = useMemo(() => {
    const congestedStations = mockMetroStations
      .filter(s => s.congestionRisk === "critical" || s.congestionRisk === "high")
      .sort((a, b) => b.projectedLoad - a.projectedLoad)[0];
    return congestedStations?.name || "28 May";
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
      {/* LEFT COLUMN - Route Options */}
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            Marşrut planlayıcısı
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Sərnişin marşrutları izdihamı əvvəlcədən görür
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            FlowAI tədbirə gedən sərnişinlər üçün ən sürətli, ən ucuz və ən az sıxlıqlı marşrutu müqayisə edir.
          </p>
        </div>

        {/* From/To Inputs */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              {t("planner.from")}
            </span>
            <input
              className="mt-1.5 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-cyan-300/60"
              onChange={(event) => setFrom(event.target.value)}
              value={from}
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600 dark:text-cyan-300">
              {t("planner.to")}
            </span>
            <input
              className="mt-1.5 h-11 w-full rounded-lg border border-cyan-300/40 bg-cyan-50/50 px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-400 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-white"
              onChange={(event) => setTo(event.target.value)}
              value={to}
            />
          </label>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filterLabels.map((item) => (
            <button
              className={`h-9 rounded-lg px-4 text-sm font-semibold transition ${
                filter === item.id
                  ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-cyan-300/50"
              }`}
              key={item.id}
              onClick={() => setFilter(item.id)}
              type="button"
            >
              {t(item.label)}
            </button>
          ))}
        </div>

        {/* Route Cards - Compact */}
        <div className="space-y-2.5">
          {routeOptions.map((option, index) => {
            const isRecommended = option.id === recommendedRoute.id;
            const badge = getRouteBadge(option, routeOptions, isRecommended);
            const isActive = activeRoute.id === option.id;
            
            return (
              <motion.div
                key={option.id}
                className={`cursor-pointer rounded-lg border p-3.5 transition ${
                  isActive
                    ? "border-cyan-400/60 bg-cyan-50/50 dark:bg-cyan-300/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/50 hover:border-cyan-300/40"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRouteId(option.id)}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                    isRecommended 
                      ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950" 
                      : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                  }`}>
                    {(() => {
                      const Icon = modeIcons[option.mode];
                      return <Icon size={18} />;
                    })()}
                  </span>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {modeLabels[option.mode]}
                      </span>
                      {badge && (
                        <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          badge.type === "recommended"
                            ? "bg-cyan-500 text-white dark:bg-cyan-300 dark:text-slate-950"
                            : badge.type === "fastest"
                            ? "bg-violet-500/20 text-violet-300"
                            : badge.type === "cheapest"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}>
                          {(() => {
                            const Icon = badge.icon;
                            return <Icon size={10} />;
                          })()}
                          {badge.label}
                        </span>
                      )}
                    </div>
                    
                    {/* Steps summary */}
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                      {option.steps.join(" → ")}
                    </p>
                    
                    {/* Metrics row */}
                    <div className="mt-2 flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Clock3 size={12} className="text-cyan-500" />
                        {option.estimatedTimeMinutes} dəq
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <CircleDollarSign size={12} className="text-emerald-500" />
                        {option.estimatedCost.toFixed(2)} AZN
                      </span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${crowdColors[option.crowdLevel]}`}>
                        {crowdLabels[option.crowdLevel]}
                      </span>
                    </div>
                    
                    {/* External redirect buttons for ride-hailing services */}
                    {/* 
                      NOTE: Deep link integration can be added later with:
                      - pickup coordinates (from location)
                      - destination coordinates (event venue)
                      - pre-filled location names
                      Example: https://bolt.eu/az-az/?pickup_lat=40.4302&pickup_lng=49.9197&dropoff_lat=...
                    */}
                    {option.mode === "bolt" && (
                      <a
                        href="https://bolt.eu/az-az/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-green-500/10 border border-green-500/30 px-2.5 py-1 text-xs font-medium text-green-400 transition hover:bg-green-500/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        Bolt ilə get
                      </a>
                    )}
                    {option.mode === "apara" && (
                      <a
                        href="https://apara.az/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        Apar ilə get
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN - Best Recommendation Panel */}
      <div className="space-y-4">
        {/* Best Route Card */}
        <motion.div 
          className="rounded-xl border border-cyan-300/30 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-2xl shadow-cyan-950/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
              <Star size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
              Ən yaxşı seçim
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoute.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Route Name */}
              <h4 className="text-xl font-bold text-white">
                {modeLabels[activeRoute.mode]}
              </h4>
              
              {/* Reason */}
              <p className="mt-1 text-sm text-cyan-200/80">
                {activeRoute.crowdLevel === "low" 
                  ? "Az sıxlıq + stabil çatma vaxtı"
                  : activeRoute.estimatedTimeMinutes <= 30
                  ? "Ən sürətli çatma vaxtı"
                  : activeRoute.estimatedCost <= 1.0
                  ? "Ən sərfəli seçim"
                  : "Balanslaşdırılmış marşrut"}
              </p>

              {/* Key Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-white/5 p-2.5 text-center">
                  <Clock3 size={16} className="mx-auto text-cyan-400 mb-1" />
                  <p className="text-lg font-bold text-white">{activeRoute.estimatedTimeMinutes}</p>
                  <p className="text-[10px] text-slate-400 uppercase">dəqiqə</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2.5 text-center">
                  <CircleDollarSign size={16} className="mx-auto text-emerald-400 mb-1" />
                  <p className="text-lg font-bold text-white">{activeRoute.estimatedCost.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 uppercase">AZN</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2.5 text-center">
                  <UsersRound size={16} className="mx-auto text-slate-400 mb-1" />
                  <p className="text-lg font-bold text-white">{crowdLabels[activeRoute.crowdLevel]}</p>
                  <p className="text-[10px] text-slate-400 uppercase">sıxlıq</p>
                </div>
              </div>

              {/* Affected congestion avoided */}
              {activeRoute.crowdLevel === "low" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
                  <TrendingDown size={14} className="text-emerald-400" />
                  <span className="text-xs text-emerald-300">
                    {avoidedStation} sıxlığından qaçır
                  </span>
                </div>
              )}

              {/* CTA Button - Dynamic based on route type */}
              {/* 
                For ride-hailing services (Bolt/Apar), button opens external app/website.
                For public transport, button is a placeholder for future booking integration.
                Deep link format for future implementation:
                - Bolt: https://bolt.eu/az-az/?pickup_lat={lat}&pickup_lng={lng}&dropoff_lat={lat}&dropoff_lng={lng}
                - Apar: https://apara.az/?from={location}&to={venue}&lat={lat}&lng={lng}
              */}
              {activeRoute.mode === "bolt" ? (
                <a
                  href="https://bolt.eu/az-az/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full h-11 rounded-lg bg-green-500 hover:bg-green-400 text-slate-950 font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  Bolt ilə get
                  <ExternalLink size={16} />
                </a>
              ) : activeRoute.mode === "apara" ? (
                <a
                  href="https://apara.az/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full h-11 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                >
                  Apar ilə get
                  <ExternalLink size={16} />
                </a>
              ) : (
                <button className="mt-4 w-full h-11 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition flex items-center justify-center gap-2">
                  Bu marşrutu seç
                  <ArrowRight size={16} />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Mini Map Preview */}
        <div className="rounded-xl border border-white/10 bg-slate-950 overflow-hidden">
          <div className="relative h-48">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            {/* Congestion zones - red areas */}
            <div className="absolute left-[20%] top-[30%] size-16 rounded-full bg-red-500/20 blur-xl" />
            <div className="absolute right-[25%] top-[40%] size-12 rounded-full bg-red-500/15 blur-lg" />
            
            {/* Route line - cyan */}
            <svg className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <motion.path
                d="M50 120 C100 80 150 100 200 60 S280 40 320 70"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="6 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>

            {/* Start point */}
            <div className="absolute left-[12%] top-[55%]">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-1">
                <MapPin size={10} className="text-emerald-400" />
                <span className="text-[10px] font-medium text-emerald-300">Başlanğıc</span>
              </div>
            </div>

            {/* Event location */}
            <div className="absolute right-[12%] top-[30%]">
              <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-1">
                <Navigation size={10} className="text-cyan-400" />
                <span className="text-[10px] font-medium text-cyan-300">Tədbir</span>
              </div>
            </div>

            {/* Congestion markers */}
            <div className="absolute left-[25%] top-[25%] flex items-center gap-1 rounded bg-red-500/20 border border-red-500/30 px-1.5 py-0.5">
              <AlertTriangle size={8} className="text-red-400" />
              <span className="text-[8px] text-red-300">Sıxlıq</span>
            </div>

            {/* Bus/Metro icons along route */}
            <div className="absolute left-[35%] top-[42%] flex size-5 items-center justify-center rounded-full bg-slate-800 border border-cyan-500/50">
              <TrainFront size={10} className="text-cyan-400" />
            </div>
            <div className="absolute left-[55%] top-[35%] flex size-5 items-center justify-center rounded-full bg-slate-800 border border-cyan-500/50">
              <BusFront size={10} className="text-cyan-400" />
            </div>
          </div>
          
          {/* Map legend */}
          <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="size-2 rounded-full bg-cyan-400" />
                Tövsiyə olunan
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="size-2 rounded-full bg-red-400" />
                Sıx zona
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Xəritə simulyasiyası</span>
          </div>
        </div>

        {/* Comparison Summary Chips */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Ən yaxşı vaxt</p>
            <p className="text-sm font-semibold text-cyan-300">
              {Math.min(...routeOptions.map(r => r.estimatedTimeMinutes))} dəq
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Ən yaxşı qiymət</p>
            <p className="text-sm font-semibold text-emerald-300">
              {Math.min(...routeOptions.map(r => r.estimatedCost)).toFixed(2)} AZN
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Ən az sıxlıq</p>
            <p className="text-sm font-semibold text-white">
              {[...routeOptions].sort((a, b) => crowdScore[a.crowdLevel] - crowdScore[b.crowdLevel])[0]?.transportType}
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-2.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">QAÇILAN stansiya</p>
            <p className="text-sm font-semibold text-red-300">{avoidedStation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
