"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BusFront,
  CheckCircle2,
  Clock3,
  Construction,
  Info,
  RadioTower,
  TrainFront,
} from "lucide-react";
import {
  MobilityAlertMock,
  MobilityAlertSeverity,
  MobilityAlertType,
  mockMobilityAlerts,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

const severityStyles: Record<MobilityAlertSeverity, string> = {
  danger:
    "border-red-400/30 bg-red-500/10 text-red-600 shadow-red-950/10 dark:text-red-300",
  info:
    "border-cyan-300/30 bg-cyan-300/10 text-cyan-700 shadow-cyan-950/10 dark:text-cyan-200",
  success:
    "border-emerald-300/30 bg-emerald-300/10 text-emerald-700 shadow-emerald-950/10 dark:text-emerald-200",
  warning:
    "border-yellow-300/30 bg-yellow-300/10 text-yellow-700 shadow-yellow-950/10 dark:text-yellow-200",
};

const typeIcons: Record<MobilityAlertType, typeof TrainFront> = {
  "bus-route-changed": BusFront,
  "event-crowd-warning": RadioTower,
  "metro-station-issue": TrainFront,
  "road-closure": Construction,
  "technical-delay": AlertTriangle,
};

export function AnnouncementsAlerts() {
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            {t("announcements.eyebrow")}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal">
            {t("announcements.title")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Alerts combine metro issues, road closures, bus changes, crowd
            warnings, and technical delays into one readable control-room view.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:shadow-blue-950/20">
          <span className="font-semibold text-slate-950 dark:text-white">
            {mockMobilityAlerts.length}
          </span>{" "}
          live alert records
        </div>
      </div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
        initial="hidden"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        viewport={{ once: true, margin: "-80px" }}
        whileInView="visible"
      >
        {mockMobilityAlerts.map((alert) => (
          <AlertCard alert={alert} key={alert.id} />
        ))}
      </motion.div>
    </div>
  );
}

function AlertCard({ alert }: { alert: MobilityAlertMock }) {
  const Icon = typeIcons[alert.type];
  const StatusIcon = alert.status === "resolved" ? CheckCircle2 : Clock3;

  return (
    <motion.article
      className={`rounded-lg border p-5 shadow-xl backdrop-blur dark:bg-slate-950/88 ${severityStyles[alert.severity]}`}
      variants={{
        hidden: { opacity: 0, scale: 0.96, y: 22 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      whileHover={{ y: -6, borderColor: "rgba(34,211,238,0.44)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 items-center justify-center rounded-lg bg-white/80 text-slate-950 ring-1 ring-black/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
          <Icon size={20} />
        </span>
        <span className="rounded-lg bg-white/70 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-700 ring-1 ring-black/5 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
          {alert.severity}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">
        {alert.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {alert.description}
      </p>

      <div className="mt-5 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Info size={15} />
          {alert.affectedLocation}
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock3 size={15} />
            {alert.time}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-white/70 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 ring-1 ring-black/5 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
            <StatusIcon size={13} />
            {alert.status}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
