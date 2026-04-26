"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Moon,
  Sun,
  Brain,
  TrainFront,
  MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { AnimatedTransportBackground } from "@/components/landing/animated-transport-background";
import { ImportITicketEvent } from "@/components/landing/import-iticket-event";
import { NotificationBell } from "@/components/notification-bell";
import { ITicketSmartIntegration } from "@/components/landing/iticket-smart-integration";
import { RoutePlannerPreview } from "@/components/landing/route-planner-preview";
import { SectionReveal } from "@/components/landing/section-reveal";
import {
  navItems,
} from "@/lib/landing-data";
import { I18nProvider, useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <I18nProvider>
      <LandingPageContent />
    </I18nProvider>
  );
}

function LandingPageContent() {
  const { t } = useI18n();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    const storedTheme = window.localStorage.getItem("azcon-flowai-theme");

    if (storedTheme) {
      return storedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem(
      "azcon-flowai-theme",
      isDark ? "dark" : "light",
    );
  }, [isDark]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-950 transition-colors duration-500 dark:bg-slate-950 dark:text-white">
      <section className="relative min-h-screen overflow-hidden border-b border-slate-200 dark:border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.16),transparent_28%),linear-gradient(135deg,#f8fafc,#e0f2fe_52%,#f8fafc)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(14,165,233,0.28),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(34,211,238,0.22),transparent_28%),linear-gradient(135deg,#020617,#07182d_54%,#020617)]" />
        <AnimatedTransportBackground />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between rounded-lg border border-white/60 bg-white/72 px-4 py-3 shadow-xl shadow-blue-950/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55">
            <a className="flex items-center gap-3" href="#">
              <span className="flex size-11 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-300 text-white shadow-lg shadow-cyan-500/20">
                <Building2 size={21} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold tracking-wide">
                  AzCon FlowAI
                </span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">
                  {t("brand.subtitle")}
                </span>
              </span>
            </a>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
              {navItems.map((item) => (
                <a
                  className="transition hover:text-blue-600 dark:hover:text-cyan-300"
                  href={item.href}
                  key={item.label}
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <NotificationBell />
              <LanguageSelector />
              <button
                aria-label="Toggle theme"
                className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-cyan-200"
                onClick={() => setIsDark((value) => !value)}
                type="button"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                className="hidden h-10 items-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200 sm:flex"
                href="#iticket"
              >
                {t("nav.startDemo")}
                <ArrowRight size={16} />
              </a>
            </div>
          </header>

          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 text-sm font-medium text-slate-600 dark:text-slate-300 md:hidden">
            {navItems.map((item) => (
              <a
                className="shrink-0 rounded-lg border border-white/60 bg-white/70 px-3 py-2 backdrop-blur transition hover:text-blue-600 dark:border-white/10 dark:bg-white/[0.05] dark:hover:text-cyan-300"
                href={item.href}
                key={item.label}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex flex-1 flex-col items-center justify-center py-12 lg:py-16">
            <motion.div
              animate="visible"
              className="flex flex-col items-center text-center"
              initial="hidden"
              transition={{ staggerChildren: 0.13 }}
            >
              <motion.h1
                className="text-balance text-6xl font-bold leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-7xl lg:text-8xl"
                variants={fadeUp}
              >
                FlowAI
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl"
                variants={fadeUp}
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div className="mt-10 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                  href="#iticket"
                >
                  {t("hero.cta.iticket")}
                  <ArrowRight size={17} />
                </a>
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/75 px-6 text-sm font-semibold text-slate-900 backdrop-blur transition hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-cyan-300/50 dark:hover:text-cyan-200"
                  href="#iticket"
                >
                  Demo başlat
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section - Product-Focused Corporate Style */}
      <SectionReveal
        className="relative w-full overflow-hidden bg-slate-950 py-24 lg:py-32"
        id="about"
      >
        {/* Background gradient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_50%,rgba(6,182,212,0.06),transparent_50%)]" />
        <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 sm:px-8 lg:flex-row lg:gap-20 lg:px-10">
          {/* Left side - Title + Product Explanation */}
          <motion.div
            className="flex-1 lg:max-w-[58%]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              {t("about.eyebrow")}
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
              {t("about.title")}
            </h2>

            {/* Product description paragraphs */}
            <div className="mt-8 space-y-5">
              <p className="text-base leading-relaxed text-slate-400">
                {t("about.p1")}
              </p>
              <p className="text-base leading-relaxed text-slate-400">
                {t("about.p2")}
              </p>
              <p className="text-base leading-relaxed text-slate-400">
                {t("about.p3")}
              </p>
            </div>
          </motion.div>

          {/* Right side - 3 Feature Blocks */}
          <motion.div
            className="flex flex-col gap-6 lg:gap-5 lg:pt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            {/* Feature 1 - AI Analysis */}
            <div className="group flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500/20">
                <Brain size={22} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("about.feature1.title")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {t("about.feature1.desc")}
                </p>
              </div>
            </div>

            {/* Feature 2 - Transport Optimization */}
            <div className="group flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500/20">
                <TrainFront size={22} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("about.feature2.title")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {t("about.feature2.desc")}
                </p>
              </div>
            </div>

            {/* Feature 3 - Smart Route Recommendation */}
            <div className="group flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 transition group-hover:bg-cyan-500/20">
                <MapPin size={22} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {t("about.feature3.title")}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {t("about.feature3.desc")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </SectionReveal>

      <SectionReveal
        className="border-y border-slate-200 bg-white/70 py-20 dark:border-white/10 dark:bg-white/[0.03]"
        id="iticket"
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ITicketSmartIntegration />
        </div>
      </SectionReveal>

      <SectionReveal
        className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-10"
        id="import-demo"
      >
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            {t("import.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">
            {t("import.sectionTitle")}
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {t("import.sectionBody")}
          </p>
        </div>
        <ImportITicketEvent />
      </SectionReveal>

      <SectionReveal
        className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10"
        id="planner"
      >
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            {t("planner.eyebrow")}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal">
            {t("planner.title")}
          </h2>
        </div>
        <RoutePlannerPreview />
      </SectionReveal>

      {/* Footer */}
      <footer className="relative w-full border-t border-white/10 bg-slate-950 py-10">
        {/* Subtle top glow line */}
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          {/* Left side - Logo and tagline */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-300 text-white">
                <Building2 size={16} />
              </span>
              <span className="text-base font-semibold text-white">AzCon FlowAI</span>
            </div>
            <p className="text-sm text-slate-400">{t("footer.tagline")}</p>
            <p className="text-xs text-slate-500">{t("footer.subtagline")}</p>
          </div>

          {/* Center/Right - Quick links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href="#about"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {t("footer.link.about")}
            </a>
            <a
              href="#iticket"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {t("footer.link.eventflow")}
            </a>
            <a
              href="#event-impact"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {t("footer.link.impact")}
            </a>
            <a
              href="#planner"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {t("footer.link.planner")}
            </a>
            <a
              href="/ops"
              className="text-slate-400 transition hover:text-cyan-300"
            >
              {t("footer.link.operator")}
            </a>
          </nav>
        </div>

        {/* Bottom copyright line */}
        <div className="mx-auto mt-8 w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-center text-xs text-slate-500 lg:text-left">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>

    </main>
  );
}
