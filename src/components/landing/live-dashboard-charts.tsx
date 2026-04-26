"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPredictionState } from "@/lib/prediction-engine";

const tooltipStyle = {
  background: "rgba(2, 6, 23, 0.94)",
  border: "1px solid rgba(34, 211, 238, 0.24)",
  borderRadius: "8px",
  boxShadow: "0 18px 40px rgba(2, 6, 23, 0.28)",
  color: "#e0f2fe",
};

export function PassengerLoadChart({
  data,
}: {
  data: DashboardPredictionState["passengerLoadByTime"];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
          <defs>
            <linearGradient id="passengerLoad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.42} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148,163,184,0.24)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#e0f2fe" }} />
          <Legend />
          <Area dataKey="baseline" name="Baseline" stroke="#64748b" strokeDasharray="5 5" fill="transparent" type="monotone" />
          <Area dataKey="passengers" name="Predicted passengers" stroke="#22d3ee" strokeWidth={3} fill="url(#passengerLoad)" type="monotone" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StationRiskChart({
  data,
}: {
  data: DashboardPredictionState["congestionRiskByStation"];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.24)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="station" tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#e0f2fe" }} />
          <Bar dataKey="load" fill="#22d3ee" name="Expected load %" radius={[6, 6, 0, 0]} />
          <Bar dataKey="risk" fill="#ef4444" name="Risk score" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EventImpactComparisonChart({
  data,
}: {
  data: DashboardPredictionState["eventImpactComparison"];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ bottom: 0, left: -18, right: 8, top: 10 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.24)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="event" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#e0f2fe" }} />
          <Legend />
          <Bar dataKey="attendance" fill="#3b82f6" name="Estimated attendance" radius={[6, 6, 0, 0]} />
          <Bar dataKey="affectedPassengers" fill="#22d3ee" name="Affected passengers" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
