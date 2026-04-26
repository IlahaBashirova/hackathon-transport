"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BellRing,
  BusFront,
  CalendarDays,
  ChevronLeft,
  Megaphone,
  Plus,
  RadioTower,
  Send,
  Ticket,
  TimerReset,
  TrainFront,
  UsersRound,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";
import {
  mockITicketEvents,
  mockMetroStations,
  mockMobilityAlerts,
  mockUpcomingEventImpacts,
} from "@/lib/mock-data";
import { getDashboardPredictionState } from "@/lib/prediction-engine";
import { I18nProvider, useI18n } from "@/lib/i18n";

const PassengerLoadChart = dynamic(
  () =>
    import("@/components/landing/live-dashboard-charts").then(
      (module) => module.PassengerLoadChart,
    ),
  { ssr: false },
);

const actionButtons = [
  {
    icon: TimerReset,
    label: "Reduce interval",
    detail: "Set target headway for affected metro stations.",
  },
  {
    icon: Plus,
    label: "Add temporary route",
    detail: "Open event shuttle or extra bus support.",
  },
  {
    icon: Send,
    label: "Send notification",
    detail: "Push route guidance to passengers.",
  },
  {
    icon: Megaphone,
    label: "Create announcement",
    detail: "Publish operator-facing public update.",
  },
];

export function OperatorDashboardPage() {
  return (
    <I18nProvider>
      <OperatorDashboardContent />
    </I18nProvider>
  );
}

function OperatorDashboardContent() {
  const { t } = useI18n();
  const [selectedEventId, setSelectedEventId] = useState(mockITicketEvents[0].id);
  const selectedEvent =
    mockITicketEvents.find((event) => event.id === selectedEventId) ??
    mockITicketEvents[0];
  const selectedImpact =
    mockUpcomingEventImpacts.find((impact) => impact.eventId === selectedEvent.id) ??
    mockUpcomingEventImpacts[0];

  const dashboardState = useMemo(() => getDashboardPredictionState(null), []);
  const affectedStations = mockMetroStations.filter((station) =>
    selectedImpact.affectedMetroStations.includes(station.name),
  );

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(37,99,235,0.18),transparent_28%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex flex-col justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-blue-950/20 backdrop-blur md:flex-row md:items-center">
          <div>
            <Link
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 transition hover:text-cyan-100"
              href="/"
            >
              <ChevronLeft size={16} />
              {t("operator.back")}
            </Link>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">
              AzCon FlowAI Operator
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-normal">
              {t("operator.header")}
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <HeaderMetric label="Imported events" value={`${mockITicketEvents.length}`} />
            <HeaderMetric label="Affected riders" value={selectedImpact.passengerImpact} />
            <HeaderMetric label="Alerts" value={`${mockMobilityAlerts.length}`} />
            <HeaderMetric label="Risk" value={selectedEvent.congestionRisk} />
          </div>
        </header>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-5">
            <Panel title={t("operator.events")} icon={Ticket}>
              <div className="space-y-3">
                {mockITicketEvents.map((event) => (
                  <motion.button
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      event.id === selectedEvent.id
                        ? "border-cyan-300/60 bg-cyan-300/10"
                        : "border-white/10 bg-white/[0.04] hover:border-cyan-300/35"
                    }`}
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    type="button"
                    whileHover={{ y: -3 }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {event.eventName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {event.venue}
                        </p>
                      </div>
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold uppercase text-cyan-100">
                        {event.congestionRisk}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <UsersRound size={13} />
                        {event.estimatedAttendance.toLocaleString()}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Panel>

            <Panel title={t("operator.actions")} icon={RadioTower}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {actionButtons.map((action) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                      key={action.label}
                      type="button"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-cyan-300 text-slate-950">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{action.label}</p>
                          <p className="mt-1 text-sm leading-5 text-slate-400">
                            {action.detail}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel title="Congestion forecast chart" icon={UsersRound}>
                <PassengerLoadChart data={dashboardState.passengerLoadByTime} />
              </Panel>

              <Panel title="Predicted passenger load" icon={TrainFront}>
                <div className="space-y-3">
                  <LoadMetric label="Event attendance" value={selectedEvent.estimatedAttendance} />
                  <LoadMetric
                    label="Ticket capacity"
                    value={selectedEvent.ticketCapacity}
                  />
                  <LoadMetric
                    label="Predicted affected riders"
                    value={Number(selectedImpact.passengerImpact.replace(/,/g, ""))}
                  />
                </div>
              </Panel>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <Panel title="Affected metro stations" icon={TrainFront}>
                <div className="space-y-3">
                  {affectedStations.map((station) => (
                    <div
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                      key={station.id}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{station.name}</p>
                          <p className="mt-1 text-sm text-slate-400">
                            Expected load {station.projectedLoad}%
                          </p>
                        </div>
                        <span className="rounded-lg bg-red-500/10 px-2.5 py-1 text-xs font-bold uppercase text-red-300 ring-1 ring-red-400/30">
                          {station.congestionRisk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Recommended transport actions" icon={BusFront}>
                <div className="space-y-3">
                  {selectedImpact.temporaryRoutes.map((route) => (
                    <div
                      className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4"
                      key={route.id}
                    >
                      <p className="text-sm font-semibold text-cyan-100">
                        {route.label}
                      </p>
                      <h3 className="mt-1 font-semibold text-white">
                        {route.from} → {route.to}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Active {route.expectedActiveTime} · {route.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <Panel title="Alert management preview" icon={BellRing}>
              <div className="grid gap-3 md:grid-cols-3">
                {mockMobilityAlerts.slice(0, 3).map((alert) => (
                  <div
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                    key={alert.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold uppercase text-slate-200">
                        {alert.severity}
                      </span>
                      <span className="text-xs capitalize text-slate-400">
                        {alert.status}
                      </span>
                    </div>
                    <h3 className="mt-4 font-semibold text-white">{alert.title}</h3>
                    <p className="mt-2 text-sm leading-5 text-slate-400">
                      {alert.affectedLocation}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </main>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold capitalize text-white">{value}</p>
    </div>
  );
}

function Panel({
  children,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  icon: typeof Ticket;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-blue-950/20 backdrop-blur">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="text-cyan-300" size={19} />
        <h2 className="font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function LoadMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="font-semibold text-white">{value.toLocaleString()}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-cyan-300"
          initial={{ width: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileInView={{ width: `${Math.min(100, value / 600)}%` }}
        />
      </div>
    </div>
  );
}
