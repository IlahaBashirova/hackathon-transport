"use client";

import { motion } from "framer-motion";
import { routeStops } from "@/lib/landing-data";

export function RouteMap() {
  return (
    <div className="relative h-80 overflow-hidden rounded-lg border border-sky-300/20 bg-slate-950/80 p-5 shadow-2xl shadow-blue-950/30">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <svg
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 640 320"
      >
        <path
          d="M62 236 C150 174 204 112 286 150 C368 188 408 206 496 104"
          fill="none"
          stroke="rgba(56,189,248,0.16)"
          strokeWidth="8"
        />
        <motion.path
          d="M62 236 C150 174 204 112 286 150 C368 188 408 206 496 104"
          fill="none"
          initial={{ pathLength: 0 }}
          stroke="#22d3ee"
          strokeLinecap="round"
          strokeWidth="4"
          transition={{ duration: 2.6, repeat: Infinity, repeatType: "reverse" }}
          whileInView={{ pathLength: 1 }}
        />
      </svg>
      {routeStops.map((stop, index) => (
        <motion.div
          className="absolute z-10"
          initial={{ opacity: 0, scale: 0.6 }}
          key={stop.name}
          style={{ left: stop.x, top: stop.y }}
          transition={{ delay: index * 0.12, duration: 0.45 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <span className="relative flex size-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-55" />
            <span className="relative inline-flex size-4 rounded-full border border-white bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.9)]" />
          </span>
          <div className="mt-2 rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-sky-100 backdrop-blur">
            <p className="font-semibold">{stop.name}</p>
            <p className="text-cyan-300">{stop.load}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
