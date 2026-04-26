"use client";

import { motion } from "framer-motion";

const stationPoints = [
  { left: "14%", top: "62%", delay: 0 },
  { left: "29%", top: "47%", delay: 0.3 },
  { left: "47%", top: "55%", delay: 0.6 },
  { left: "63%", top: "34%", delay: 0.9 },
  { left: "81%", top: "43%", delay: 1.2 },
];

export function AnimatedTransportBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
      <motion.div
        className="absolute inset-x-[-12%] top-1/4 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-70"
        animate={{ x: ["-18%", "18%"], opacity: [0.15, 0.75, 0.15] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-y-[-12%] right-1/4 w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60"
        animate={{ y: ["18%", "-18%"], opacity: [0.1, 0.65, 0.1] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[62%] w-full text-cyan-300"
        preserveAspectRatio="none"
        viewBox="0 0 1200 520"
      >
        <defs>
          <linearGradient id="routeGlow" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.18" />
          </linearGradient>
        </defs>
        <path
          d="M0 420 C150 360 210 250 350 280 C520 318 560 160 700 188 C870 222 910 92 1200 128"
          fill="none"
          stroke="rgba(125,211,252,0.18)"
          strokeWidth="3"
        />
        <motion.path
          d="M0 420 C150 360 210 250 350 280 C520 318 560 160 700 188 C870 222 910 92 1200 128"
          fill="none"
          stroke="url(#routeGlow)"
          strokeLinecap="round"
          strokeWidth="4"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.15, 0.42, 0.15], pathOffset: [0, 0.85] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {stationPoints.map((point) => (
        <motion.span
          aria-hidden="true"
          className="absolute size-3 rounded-full bg-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.9)]"
          key={`${point.left}-${point.top}`}
          style={{ left: point.left, top: point.top }}
          animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.9, 1] }}
          transition={{
            delay: point.delay,
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
