"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { predictionData } from "@/lib/landing-data";

export function CongestionChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={predictionData}
          margin={{ left: -24, right: 10, top: 12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="metroLoad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.04} />
            </linearGradient>
            <linearGradient id="busLoad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.34} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(148,163,184,0.28)"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            axisLine={false}
            dataKey="time"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: "#22d3ee", strokeWidth: 1 }}
            contentStyle={{
              background: "rgba(2, 6, 23, 0.92)",
              border: "1px solid rgba(34, 211, 238, 0.24)",
              borderRadius: "8px",
              boxShadow: "0 18px 40px rgba(2, 6, 23, 0.28)",
              color: "#e0f2fe",
            }}
            labelStyle={{ color: "#e0f2fe" }}
          />
          <Area
            dataKey="baseline"
            name="Normal baseline"
            stroke="#64748b"
            strokeDasharray="5 5"
            strokeWidth={2}
            fill="transparent"
            type="monotone"
          />
          <Area
            dataKey="metro"
            name="Metro pressure"
            stroke="#22d3ee"
            strokeWidth={3}
            fill="url(#metroLoad)"
            type="monotone"
          />
          <Area
            dataKey="bus"
            name="Bus pressure"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#busLoad)"
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
