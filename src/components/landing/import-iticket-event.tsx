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
  Bus,
  AlertTriangle,
  Globe,
  Brain,
  Activity,
  Info,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import {
  ExtractedEventData,
  PredictionEngineResult,
  ProcessingStatus,
  TransportImpactRecommendation,
} from "@/lib/ai/types";
import { CongestionRisk } from "@/lib/mock-data";
import { useI18n } from "@/lib/i18n";

type ImportStep = "idle" | "fetching" | "extracting" | "predicting" | "complete";

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
  const [prediction, setPrediction] = useState<PredictionEngineResult | null>(null);
  const [recommendation, setRecommendation] = useState<TransportImpactRecommendation | null>(null);
  const [status, setStatus] = useState<ProcessingStatus | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const isProcessing = step === "fetching" || step === "extracting" || step === "predicting";
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

    // Reset state
    setResult(null);
    setPrediction(null);
    setRecommendation(null);
    setStatus(null);
    setWarning(null);
    setStep("fetching");

    try {
      // Call the unified analysis API
      const response = await fetch("/api/event/analyze", {
        body: JSON.stringify({ url: linkValue.trim() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const payload = await response.json() as {
        success: boolean;
        event: ExtractedEventData;
        prediction?: PredictionEngineResult;
        recommendation: TransportImpactRecommendation;
        status: ProcessingStatus;
        warning?: string;
        error?: string;
      };

      if (!payload.success) {
        throw new Error(payload.error || "Analysis failed");
      }

      // Update state with results
      setResult(payload.event);
      setPrediction(payload.prediction || null);
      setRecommendation(payload.recommendation);
      setStatus(payload.status);
      if (payload.warning) {
        setWarning(payload.warning);
      }

      onProcessed?.({
        event: payload.event,
        recommendation: payload.recommendation,
      });

      setStep("complete");
    } catch (error) {
      console.error("Import failed:", error);
      // Show error but keep form usable
      setWarning(error instanceof Error ? error.message : "Import failed");
      setStep("idle");
    }
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
                placeholder="https://iticket.az/events/demo-event"
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
                  {step === "fetching" && "Fetching event page..."}
                  {step === "extracting" && "Extracting event details with AI..."}
                  {step === "predicting" && "Calculating transport impact..."}
                  {step === "idle" && t("import.idle")}
                  {step === "complete" && t("import.complete")}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{
                  width:
                    step === "idle"
                      ? "8%"
                      : step === "fetching"
                        ? "25%"
                        : step === "extracting"
                          ? "55%"
                          : step === "predicting"
                            ? "85%"
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
                    value={result.date 
                      ? `${result.date}${result.startTime && result.endTime ? ` · ${result.startTime}-${result.endTime}` : ""}` 
                      : "Unknown"}
                  />
                  <InfoTile
                    icon={Ticket}
                    label="Ticket capacity"
                    value={result.ticketCapacity?.toLocaleString() ?? "Not available"}
                  />
                  <InfoTile
                    icon={UsersRound}
                    label="Estimated attendance"
                    value={result.estimatedAttendance?.toLocaleString() ?? "Not available"}
                  />
                  <InfoTile
                    icon={TrainFront}
                    label="Nearest metro stations"
                    value={result.nearestMetroStations.join(", ") || "None identified"}
                  />
                </div>

                {/* Prediction Data */}
                {prediction && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <InfoTile
                      icon={TrainFront}
                      label="Metro congestion"
                      value={`${prediction.metroCongestionScore}/100 (${prediction.metroPassengers.toLocaleString()} pax)`}
                    />
                    <InfoTile
                      icon={Bus}
                      label="Bus congestion"
                      value={`${prediction.busCongestionScore}/100 (${prediction.busPassengers.toLocaleString()} pax)`}
                    />
                    <InfoTile
                      icon={CalendarDays}
                      label="Peak arrival"
                      value={prediction.peakArrivalWindow}
                    />
                    <InfoTile
                      icon={CalendarDays}
                      label="Peak exit"
                      value={prediction.peakExitWindow}
                    />
                  </div>
                )}

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

                {/* Warning message */}
                {warning && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                    <AlertTriangle size={14} />
                    {warning}
                  </div>
                )}

                {/* Technical Status Card */}
                {status && <TechnicalStatusCard status={status} prediction={prediction || undefined} />}
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

/**
 * Technical Status Card - shows which components are real vs mock
 */
function TechnicalStatusCard({ status, prediction }: { status: ProcessingStatus; prediction?: PredictionEngineResult }) {
  const getStatusIcon = (value: string) => {
    if (value === "real" || value === "openai" || value === "formula-based") {
      return <CheckCircle2 size={12} className="text-emerald-400" />;
    }
    return <AlertTriangle size={12} className="text-amber-400" />;
  };

  const getStatusColor = (value: string) => {
    if (value === "real" || value === "openai" || value === "formula-based") {
      return "text-emerald-400";
    }
    if (value === "fallback" || value === "mock") {
      return "text-amber-400";
    }
    return "text-red-400";
  };

  return (
    <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/55 p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Info size={14} />
        <span>Technical Status (Dev Mode)</span>
      </div>
      <div className="grid gap-1.5 text-xs sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Globe size={12} className="text-slate-500" />
          <span className="text-slate-400">URL Fetch:</span>
          <span className={`flex items-center gap-1 font-medium ${getStatusColor(status.urlFetch)}`}>
            {getStatusIcon(status.urlFetch)}
            {status.urlFetch === "real" ? "Real" : status.urlFetch === "failed" ? "Failed" : "Fallback"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Brain size={12} className="text-slate-500" />
          <span className="text-slate-400">AI Provider:</span>
          <span className={`flex items-center gap-1 font-medium ${getStatusColor(status.aiProvider)}`}>
            {getStatusIcon(status.aiProvider)}
            {status.aiProvider === "openai" ? "OpenAI" : "Mock"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={12} className="text-slate-500" />
          <span className="text-slate-400">Prediction:</span>
          <span className={`flex items-center gap-1 font-medium ${getStatusColor(status.prediction)}`}>
            {getStatusIcon(status.prediction)}
            {status.prediction === "formula-based" ? "Formula-based" : "Mock"}
          </span>
        </div>
        {prediction && (
          <div className="flex items-center gap-2">
            <UsersRound size={12} className="text-slate-500" />
            <span className="text-slate-400">Attendance:</span>
            <span className={`font-medium ${prediction.isBasedOnRealCapacity ? "text-emerald-400" : "text-amber-400"}`}>
              {prediction.isBasedOnRealCapacity ? "Real capacity" : "Estimated"}
            </span>
          </div>
        )}
      </div>
      {status.usingDemoFallback && (
        <div className="mt-2 flex items-center gap-2 rounded bg-amber-500/10 px-2 py-1 text-xs text-amber-300">
          <AlertTriangle size={12} />
          Demo fallback data used
        </div>
      )}
    </div>
  );
}
