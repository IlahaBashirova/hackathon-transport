"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  Link,
  Loader2,
  MapPin,
  Sparkles,
  Ticket,
  TrainFront,
  UsersRound,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  ExtractedEventData,
  TransportImpactRecommendation,
} from "@/lib/ai/types";
import {
  CongestionRisk,
  mockITicketEvents,
  mockUpcomingEventImpacts,
} from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

type ImportStep = "idle" | "reading" | "extracting" | "complete";

const riskStyles = {
  critical: "border-red-400/40 bg-red-500/10 text-red-300",
  high: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  medium: "border-cyan-300/40 bg-cyan-300/10 text-cyan-200",
  low: "border-emerald-300/40 bg-emerald-300/10 text-emerald-200",
};

export type ProcessedEventImpact = {
  event: ExtractedEventData;
  recommendation: TransportImpactRecommendation;
};

function delay(duration: number) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

export function ImportITicketEvent({
  onProcessed,
}: {
  onProcessed?: (result: ProcessedEventImpact) => void;
}) {
  const { t } = useI18n();
  const [linkValue, setLinkValue] = useState("");
  const [step, setStep] = useState<ImportStep>("idle");
  const [result, setResult] = useState<ExtractedEventData | null>(null);
  const [recommendation, setRecommendation] =
    useState<TransportImpactRecommendation | null>(null);

  const isProcessing = step === "reading" || step === "extracting";
  const canAnalyze = linkValue.trim().length > 0 && !isProcessing;

  const actionTitles = useMemo(
    () => recommendation?.recommendedActions ?? [],
    [recommendation],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canAnalyze) {
      return;
    }

    setResult(null);
    setRecommendation(null);
    setStep("reading");

    await delay(850);

    const extractResponse = await fetch("/api/ai/extract-event", {
      body: JSON.stringify({ rawText: linkValue.trim() }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const extractPayload = (await extractResponse.json()) as {
      event: ExtractedEventData;
    };
    const extractedEvent = extractPayload.event;

    setStep("extracting");
    await delay(950);

    const sourceEvent = mockITicketEvents.find(
      (mockEvent) => mockEvent.eventName === extractedEvent.eventName,
    );
    const impact = mockUpcomingEventImpacts.find(
      (item) => item.eventId === sourceEvent?.id,
    );
    const congestionRisk: CongestionRisk =
      sourceEvent?.congestionRisk ?? "high";

    const recommendResponse = await fetch("/api/ai/recommend-impact", {
      body: JSON.stringify({
        event: extractedEvent,
        prediction: {
          congestionRisk,
          confidence: 0.91,
          passengerImpact: impact?.passengerImpact ?? "8,500",
          peakTime: impact?.peakTime ?? "18:00-19:30",
        },
      }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const recommendPayload = (await recommendResponse.json()) as {
      recommendation: TransportImpactRecommendation;
    };

    setResult(extractedEvent);
    setRecommendation(recommendPayload.recommendation);
    onProcessed?.({
      event: extractedEvent,
      recommendation: recommendPayload.recommendation,
    });
    setStep("complete");
  }

  return (
    <div className="mt-8 rounded-lg border border-cyan-300/25 bg-slate-950/72 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="lg:w-[42%]">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-lg bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.55)]">
              <Link size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Demo event import
              </p>
              <h3 className="text-2xl font-semibold text-white">
                {t("import.title")}
              </h3>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            {t("import.body")}
          </p>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="event-link">
              Event page link
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="h-12 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/10"
                id="event-link"
                onChange={(event) => setLinkValue(event.target.value)}
                placeholder="https://events.az/demo-event"
                type="url"
                value={linkValue}
              />
              <button
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                disabled={!canAnalyze}
                type="submit"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  <Sparkles size={17} />
                )}
                {t("import.button")}
              </button>
            </div>
          </form>

          <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3">
              {isProcessing ? (
                <Loader2 className="animate-spin text-cyan-300" size={18} />
              ) : step === "complete" ? (
                <CheckCircle2 className="text-cyan-300" size={18} />
              ) : (
                <Ticket className="text-cyan-300" size={18} />
              )}
              <AnimatePresence mode="wait">
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-slate-200"
                  exit={{ opacity: 0, y: -6 }}
                  initial={{ opacity: 0, y: 6 }}
                  key={step}
                  transition={{ duration: 0.2 }}
                >
                  {t(`import.${step}`)}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{
                  width:
                    step === "idle"
                      ? "8%"
                      : step === "reading"
                        ? "42%"
                        : step === "extracting"
                          ? "74%"
                          : "100%",
                }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        <div className="min-h-80 flex-1">
          <AnimatePresence mode="wait">
            {result && recommendation && step === "complete" ? (
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="rounded-lg border border-cyan-300/25 bg-white/[0.06] p-4"
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                key={result.eventName}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Extracted sample event
                    </p>
                    <h4 className="mt-2 text-2xl font-semibold text-white">
                      {result.eventName}
                    </h4>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="text-cyan-300" size={16} />
                      {result.venue}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] ${riskStyles[recommendation.congestionRisk]}`}
                  >
                    {recommendation.congestionRisk}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <InfoTile
                    icon={CalendarDays}
                    label="Date / time"
                    value={`${result.date} · ${result.startTime}-${result.endTime}`}
                  />
                  <InfoTile
                    icon={Ticket}
                    label="Ticket capacity"
                    value={result.ticketCapacity.toLocaleString()}
                  />
                  <InfoTile
                    icon={UsersRound}
                    label="Estimated attendance"
                    value={result.estimatedAttendance.toLocaleString()}
                  />
                  <InfoTile
                    icon={TrainFront}
                    label="Nearest metro stations"
                    value={result.nearestMetroStations.join(", ")}
                  />
                </div>

                <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
                  <p className="text-sm font-semibold text-cyan-100">
                    Congestion summary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {recommendation.congestionSummary}
                  </p>
                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    {recommendation.userFacingAnnouncementText}
                  </p>
                </div>

                <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/55 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cyan-200">
                    <BellRing size={17} />
                    Recommended transport actions
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {actionTitles.map((action) => (
                      <div
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300"
                        key={action}
                      >
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full min-h-80 items-center justify-center rounded-lg border border-dashed border-cyan-300/25 bg-white/[0.03] p-6 text-center"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 10 }}
                key="placeholder"
              >
                <div>
                  <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                    <Ticket size={26} />
                  </div>
                  <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
                    A mobility result card will appear here after the demo
                    importer reads and extracts event details.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

type InfoTileProps = {
  icon: typeof CalendarDays;
  label: string;
  value: string;
};

function InfoTile({ icon: Icon, label, value }: InfoTileProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
      <Icon className="text-cyan-300" size={17} />
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
