"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LanguageSelector } from "@/components/language-selector";
import { AnimatedTransportBackground } from "@/components/landing/animated-transport-background";
import { AnnouncementsAlerts } from "@/components/landing/announcements-alerts";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { ITicketSmartIntegration } from "@/components/landing/iticket-smart-integration";
import { RoutePlannerPreview } from "@/components/landing/route-planner-preview";
import { SectionReveal } from "@/components/landing/section-reveal";
import {
  aboutStats,
  heroStats,
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

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
            <motion.div
              animate="visible"
              className="max-w-3xl"
              initial="hidden"
              transition={{ staggerChildren: 0.13 }}
            >
              <motion.div
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-white/80 px-3 py-2 text-sm font-medium text-blue-800 shadow-lg shadow-cyan-500/10 backdrop-blur dark:bg-cyan-300/10 dark:text-cyan-100"
                variants={fadeUp}
              >
                <Sparkles size={16} />
                {t("hero.badge")}
              </motion.div>

              <motion.h1
                className="text-balance text-5xl font-semibold leading-[1.02] tracking-normal text-slate-950 dark:text-white sm:text-6xl lg:text-7xl"
                variants={fadeUp}
              >
                {t("hero.title")}
              </motion.h1>

              <motion.p
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl"
                variants={fadeUp}
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={fadeUp}>
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200"
                  href="#iticket"
                >
                  {t("hero.cta.iticket")}
                  <ArrowRight size={17} />
                </a>
                <a
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/75 px-5 text-sm font-semibold text-slate-900 backdrop-blur transition hover:border-blue-300 hover:text-blue-700 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-cyan-300/50 dark:hover:text-cyan-200"
                  href="/operator"
                >
                  {t("hero.cta.operator")}
                </a>
              </motion.div>

              <motion.div
                className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3"
                variants={fadeUp}
              >
                {heroStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      className="rounded-lg border border-white/70 bg-white/72 p-4 shadow-lg shadow-blue-950/5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]"
                      key={stat.label}
                      whileHover={{ y: -5 }}
                    >
                      <Icon className="text-blue-600 dark:text-cyan-300" size={20} />
                      <p className="mt-4 text-2xl font-semibold">{stat.value}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                        {stat.label}
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative"
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="absolute -inset-6 rounded-[32px] bg-cyan-400/15 blur-3xl" />
              <DashboardPreview />
            </motion.div>
          </div>
        </div>
      </section>

      <SectionReveal
        className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:px-10"
        id="about"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
            {t("about.eyebrow")}
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 dark:text-white">
            {t("about.title")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t("about.body")}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {aboutStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-blue-950/20"
                key={stat.label}
                whileHover={{ y: -6, borderColor: "rgba(34,211,238,0.45)" }}
              >
                <Icon className="text-blue-600 dark:text-cyan-300" size={23} />
                <p className="mt-7 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-2 font-medium">{stat.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {stat.detail}
                </p>
              </motion.div>
            );
          })}
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

      <SectionReveal
        className="border-y border-slate-200 bg-white/70 py-20 dark:border-white/10 dark:bg-white/[0.03]"
        id="announcements"
      >
        <AnnouncementsAlerts />
      </SectionReveal>
    </main>
  );
}
