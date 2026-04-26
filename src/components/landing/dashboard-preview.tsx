"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, BusFront, TrainFront } from "lucide-react";
import { dashboardMetrics } from "@/lib/landing-data";

const CongestionChart = dynamic(
  () =>
    import("@/components/landing/congestion-chart").then(
      (module) => module.CongestionChart,
    ),
  { ssr: false },
);

export function DashboardPreview() {
  return (
    <div className="rounded-lg border border-sky-300/20 bg-slate-950 p-4 text-white shadow-2xl shadow-blue-950/30">
      <div className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div>
          <p className="text-sm text-sky-200/70">Live mobility dashboard</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-normal">
            Sea Breeze concert forecast
          </h3>
        </div>
        <motion.div
          className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-200"
          animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 28px rgba(34,211,238,0.35)", "0 0 0 rgba(34,211,238,0)"] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          <Activity size={22} />
        </motion.div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <motion.div
            className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
            key={metric.label}
            whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.45)" }}
          >
            <span className={`mb-4 block h-1.5 w-12 rounded-full ${metric.color}`} />
            <p className="text-xs text-slate-400">{metric.label}</p>
            <p className="mt-1 text-xl font-semibold">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-slate-900/80 p-4">
          <CongestionChart />
        </div>
        <div className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-cyan-400/15 to-blue-600/10 p-4">
            <div className="flex items-center justify-between">
              <TrainFront className="text-cyan-200" size={22} />
              <ArrowUpRight className="text-cyan-200" size={18} />
            </div>
            <p className="mt-7 text-sm text-slate-300">Metro pressure</p>
            <p className="mt-1 text-3xl font-semibold">94%</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-blue-500/15 to-sky-400/10 p-4">
            <BusFront className="text-sky-200" size={22} />
            <p className="mt-7 text-sm text-slate-300">Feeder route demand</p>
            <p className="mt-1 text-3xl font-semibold">+31%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
