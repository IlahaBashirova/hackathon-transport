"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  TrainFront,
  BusFront,
  Construction,
  RadioTower,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  X,
  Check,
  Filter,
} from "lucide-react";
import {
  MobilityAlertMock,
  MobilityAlertSeverity,
  MobilityAlertType,
  MobilityAlertStatus,
  mockMobilityAlerts,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

const severityStyles: Record<MobilityAlertSeverity, { bg: string; border: string; icon: string; dot: string }> = {
  danger: {
    bg: "bg-red-500/10 hover:bg-red-500/15",
    border: "border-red-400/30",
    icon: "text-red-400",
    dot: "bg-red-500",
  },
  warning: {
    bg: "bg-amber-500/10 hover:bg-amber-500/15",
    border: "border-amber-400/30",
    icon: "text-amber-400",
    dot: "bg-amber-500",
  },
  info: {
    bg: "bg-cyan-500/10 hover:bg-cyan-500/15",
    border: "border-cyan-400/30",
    icon: "text-cyan-400",
    dot: "bg-cyan-500",
  },
  success: {
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    border: "border-emerald-400/30",
    icon: "text-emerald-400",
    dot: "bg-emerald-500",
  },
};

const typeIcons: Record<MobilityAlertType, typeof TrainFront> = {
  "bus-route-changed": BusFront,
  "event-crowd-warning": RadioTower,
  "metro-station-issue": TrainFront,
  "road-closure": Construction,
  "technical-delay": AlertTriangle,
};


const statusColors: Record<MobilityAlertStatus, string> = {
  active: "text-red-300 bg-red-500/20",
  monitoring: "text-amber-300 bg-amber-500/20",
  resolved: "text-emerald-300 bg-emerald-500/20",
  scheduled: "text-cyan-300 bg-cyan-500/20",
};

type FilterType = "all" | "active" | "resolved";

export function NotificationBell() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const statusLabels: Record<MobilityAlertStatus, string> = {
    active: t("notifications.status.active"),
    monitoring: t("notifications.status.monitoring"),
    resolved: t("notifications.status.resolved"),
    scheduled: t("notifications.status.scheduled"),
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter alerts
  const filteredAlerts = mockMobilityAlerts.filter((alert) => {
    if (filter === "active") return alert.status === "active" || alert.status === "monitoring" || alert.status === "scheduled";
    if (filter === "resolved") return alert.status === "resolved";
    return true;
  });

  // Count unread active alerts
  const unreadCount = mockMobilityAlerts.filter(
    (alert) => !readIds.has(alert.id) && alert.status !== "resolved"
  ).length;

  const activeCount = mockMobilityAlerts.filter(
    (alert) => alert.status !== "resolved"
  ).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    const allIds = mockMobilityAlerts.map((a) => a.id);
    setReadIds(new Set(allIds));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-cyan-200"
        aria-label="Notifications"
      >
        <Bell size={18} />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        
        {/* Just a dot if there are active but all are read */}
        {unreadCount === 0 && activeCount > 0 && (
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-cyan-500" />
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[380px] overflow-hidden rounded-xl border border-white/20 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <h3 className="font-semibold text-white">{t("notifications.title")}</h3>
                <p className="text-xs text-slate-400">
                  {activeCount} {t("notifications.activeCount")}, {mockMobilityAlerts.length} {t("notifications.totalCount")}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={markAllAsRead}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-cyan-300"
                  title={t("notifications.markAllRead")}
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
                  title={t("notifications.close")}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-white/10 px-2">
              {[
                { id: "all", label: t("notifications.filter.all") },
                { id: "active", label: t("notifications.filter.active") },
                { id: "resolved", label: t("notifications.filter.resolved") },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as FilterType)}
                  className={`relative px-3 py-2 text-xs font-medium transition ${
                    filter === tab.id
                      ? "text-cyan-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                  {filter === tab.id && (
                    <motion.div
                      layoutId="filter-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Filter size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">{t("notifications.empty")}</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredAlerts.map((alert, index) => (
                    <NotificationItem
                      key={alert.id}
                      alert={alert}
                      isRead={readIds.has(alert.id)}
                      onClick={() => markAsRead(alert.id)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/10">
                {t("notifications.viewAll")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  alert,
  isRead,
  onClick,
  index,
}: {
  alert: MobilityAlertMock;
  isRead: boolean;
  onClick: () => void;
  index: number;
}) {
  const { t } = useI18n();
  const Icon = typeIcons[alert.type];
  const styles = severityStyles[alert.severity];
  const StatusIcon = alert.status === "resolved" ? CheckCircle2 : Clock3;

  const statusLabels: Record<MobilityAlertStatus, string> = {
    active: t("notifications.status.active"),
    monitoring: t("notifications.status.monitoring"),
    resolved: t("notifications.status.resolved"),
    scheduled: t("notifications.status.scheduled"),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`cursor-pointer p-3 transition ${
        isRead ? "opacity-70" : "opacity-100"
      } ${styles.bg}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${styles.border} bg-slate-950/50`}>
          <Icon size={16} className={styles.icon} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-medium leading-tight ${isRead ? "text-slate-300" : "text-white"}`}>
              {t(alert.titleKey)}
            </h4>
            {!isRead && <span className={`size-2 shrink-0 rounded-full ${styles.dot}`} />}
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-400">
            {t(alert.descKey)}
          </p>

          {/* Meta row */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusColors[alert.status]}`}>
              <StatusIcon size={10} className="inline mr-1" />
              {statusLabels[alert.status]}
            </span>
            <span className="text-[10px] text-slate-500">{alert.time}</span>
            <span className="truncate text-[10px] text-slate-500">{t(alert.locationKey)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
