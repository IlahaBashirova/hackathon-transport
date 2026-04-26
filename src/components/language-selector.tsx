"use client";

import { Globe2 } from "lucide-react";
import { languages, useI18n } from "@/lib/i18n";

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-1 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      <Globe2 className="ml-2 text-blue-600 dark:text-cyan-300" size={16} />
      {languages.map((item) => (
        <button
          className={`h-8 rounded-md px-2 text-xs font-bold transition ${
            language === item.code
              ? "bg-slate-950 text-white dark:bg-cyan-300 dark:text-slate-950"
              : "text-slate-500 hover:text-blue-700 dark:text-slate-300 dark:hover:text-cyan-200"
          }`}
          key={item.code}
          onClick={() => setLanguage(item.code)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
