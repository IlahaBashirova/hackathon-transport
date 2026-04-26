"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "az" | "en" | "ru";

type Dictionary = Record<string, string>;

export const languages: Array<{ code: Language; label: string }> = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

const dictionaries: Record<Language, Dictionary> = {
  az: {
    "nav.about": "Haqqında",
    "nav.iticket": "EventFlow",
    "nav.impact": "Təsir",
    "nav.planner": "Marşrut",
    "nav.ops": "Operator",
    "nav.startDemo": "Demoya başla",
    "brand.subtitle": "Ağıllı mobillik proqnozu",
    "hero.badge": "Tədbir yönümlü şəhərlər üçün AI nəqliyyat analitikası",
    "hero.title":
      "Bakıda sıxlığı hərəkət xaosa çevrilməzdən əvvəl proqnozlaşdırın.",
    "hero.subtitle":
      "AzCon FlowAI tədbir tələbatını, metro aktivliyini, avtobus tutumunu və canlı şəhər siqnallarını sərnişinlər üçün aydın marşrut tövsiyələrinə çevirir.",
    "hero.cta.iticket": "EventFlow-a bax",
    "hero.cta.operator": "Operator panelini aç",
    "about.eyebrow": "AzCon FlowAI haqqında",
    "about.title":
      "Nəqliyyat və rabitəni vahid sistem kimi görən ağıllı şəhər proqnoz qatı.",
    "about.body":
      "AZCON-un vahid infrastruktur missiyasından ilhamlanan FlowAI böyük tədbirlərin şəhər hərəkətinə çevrildiyi anı izləyir: çıxışlar, keçidlər, avtobuslar, metro platformaları və operator qərarları.",
    "iticket.badge": "EventFlow",
    "iticket.title": "Tədbir → proqnozlaşdırılan sıxlıq → ən yaxşı marşrut",
    "iticket.subtitle":
      "FlowAI tədbir tələbatını oxuyur, yaxın metro və avtobus xətlərində sıxlığı proqnozlaşdırır və tədbirə çatmaq üçün ən rahat yolu göstərir.",
    "iticket.input": "Giriş",
    "iticket.events": "Tədbirlər",
    "iticket.ai": "AI Analizi",
    "iticket.aiBody":
      "Tədbir miqyası, iştirak, vaxt, stansiya yaxınlığı və nəqliyyat tutumu canlı sıxlıq proqnozuna çevrilir.",
    "iticket.output": "Çıxış",
    "iticket.optimization": "Nəqliyyat optimallaşdırması",
    "import.title": "Tədbiri import et",
    "import.body":
      "FlowAI-nin tədbir səhifəsini nəqliyyat proqnoz məlumatına necə çevirdiyini simulyasiya etmək üçün istənilən tədbir linkini daxil edin. Bu demo mock parsing istifadə edir; real scraping hələ tətbiq olunmayıb.",
    "import.button": "Tədbiri analiz et",
    "import.idle": "Demo import üçün tədbir linkini daxil edin.",
    "import.reading": "Tədbir məlumatları oxunur...",
    "import.extracting": "AI tədbir detallarını çıxarır...",
    "import.complete": "Demo tədbir detalları çıxarıldı.",
    "planner.eyebrow": "Marşrut planlayıcısı",
    "planner.title": "Sərnişin marşrutları izdihamın harada olacağını bilir.",
    "planner.from": "Haradan",
    "planner.to": "Haraya",
    "planner.fastest": "Ən sürətli",
    "planner.cheapest": "Ən ucuz",
    "planner.leastCrowded": "Ən az sıx",
    "announcements.eyebrow": "Elanlar və xəbərdarlıqlar",
    "announcements.title": "Mobillik insidentləri üçün canlı operator lenti.",
    "operator.back": "Ana səhifəyə qayıt",
    "operator.header": "Nəqliyyat idarəetmə paneli",
    "operator.events": "Import edilmiş tədbirlər",
    "operator.actions": "Operator əməliyyatları",
  },
  en: {
    "nav.about": "About",
    "nav.iticket": "EventFlow",
    "nav.impact": "Impact",
    "nav.planner": "Planner",
    "nav.ops": "Ops",
    "nav.startDemo": "Start demo",
    "brand.subtitle": "Smart mobility prediction",
    "hero.badge": "AI transport intelligence for event-driven cities",
    "hero.title":
      "Forecast congestion across Baku before movement becomes chaos.",
    "hero.subtitle":
      "AzCon FlowAI converts event demand, metro activity, bus capacity, and live city signals into clear route recommendations for passengers.",
    "hero.cta.iticket": "Explore EventFlow",
    "hero.cta.operator": "Open operator console",
    "about.eyebrow": "About AzCon FlowAI",
    "about.title":
      "A smart city prediction layer for transport and communications as one system.",
    "about.body":
      "Inspired by AZCON's unified infrastructure mission, FlowAI focuses on the moment where major events become city movement: exits, transfers, buses, metro platforms, and control-room actions.",
    "iticket.badge": "EventFlow",
    "iticket.title": "Event → predicted congestion → best route",
    "iticket.subtitle":
      "FlowAI reads event demand, predicts pressure on nearby metro and bus routes, then recommends the smoothest way to reach the venue.",
    "iticket.input": "Input",
    "iticket.events": "Events",
    "iticket.ai": "AI Analysis",
    "iticket.aiBody":
      "Event scale, attendance, time, station proximity, and transport capacity are scored into a live congestion prediction.",
    "iticket.output": "Output",
    "iticket.optimization": "Transport optimization",
    "import.title": "Import Event",
    "import.body":
      "Paste any event URL to simulate how FlowAI would turn an event page into transport prediction data. This demo uses mock parsing; no real scraping is implemented yet.",
    "import.button": "Analyze Event",
    "import.idle": "Paste an event link to run the demo importer.",
    "import.reading": "Reading event data...",
    "import.extracting": "AI is extracting event details...",
    "import.complete": "Demo event details extracted.",
    "planner.eyebrow": "Route planner preview",
    "planner.title": "Passenger routing that knows where crowds will be.",
    "planner.from": "From",
    "planner.to": "To",
    "planner.fastest": "Fastest",
    "planner.cheapest": "Cheapest",
    "planner.leastCrowded": "Least crowded",
    "announcements.eyebrow": "Announcements & alerts",
    "announcements.title": "Live operator feed for mobility incidents.",
    "operator.back": "Back to homepage",
    "operator.header": "Transport control dashboard",
    "operator.events": "Imported events",
    "operator.actions": "Operator actions",
  },
  ru: {
    "nav.about": "О платформе",
    "nav.iticket": "EventFlow",
    "nav.impact": "Влияние",
    "nav.planner": "Маршрут",
    "nav.ops": "Оператор",
    "nav.startDemo": "Запустить демо",
    "brand.subtitle": "Прогноз умной мобильности",
    "hero.badge": "AI-аналитика транспорта для событийного города",
    "hero.title":
      "Прогнозируйте заторы в Баку до того, как движение станет хаосом.",
    "hero.subtitle":
      "AzCon FlowAI превращает спрос на события, активность метро, вместимость автобусов и городские сигналы в понятные рекомендации маршрута для пассажиров.",
    "hero.cta.iticket": "Открыть EventFlow",
    "hero.cta.operator": "Открыть панель оператора",
    "about.eyebrow": "Об AzCon FlowAI",
    "about.title":
      "Прогнозный слой умного города для транспорта и связи как единой системы.",
    "about.body":
      "Вдохновленный миссией AZCON, FlowAI отслеживает момент, когда крупные события превращаются в городское движение: выходы, пересадки, автобусы, платформы метро и действия операторов.",
    "iticket.badge": "EventFlow",
    "iticket.title": "Событие → прогноз заторов → лучший маршрут",
    "iticket.subtitle":
      "FlowAI считывает спрос на событие, прогнозирует нагрузку на метро и автобусы и предлагает самый удобный путь к площадке.",
    "iticket.input": "Вход",
    "iticket.events": "События",
    "iticket.ai": "AI-анализ",
    "iticket.aiBody":
      "Масштаб события, посещаемость, время, близость станций и вместимость транспорта превращаются в прогноз заторов.",
    "iticket.output": "Выход",
    "iticket.optimization": "Оптимизация транспорта",
    "import.title": "Импорт события",
    "import.body":
      "Вставьте любую ссылку на событие, чтобы смоделировать преобразование страницы события в транспортный прогноз. В демо используется mock parsing; реальный scraping пока не реализован.",
    "import.button": "Анализировать событие",
    "import.idle": "Вставьте ссылку на событие для демо импорта.",
    "import.reading": "Чтение данных события...",
    "import.extracting": "AI извлекает детали события...",
    "import.complete": "Демо-данные события извлечены.",
    "planner.eyebrow": "Планировщик маршрута",
    "planner.title": "Маршруты пассажиров учитывают будущую плотность толпы.",
    "planner.from": "Откуда",
    "planner.to": "Куда",
    "planner.fastest": "Быстрее",
    "planner.cheapest": "Дешевле",
    "planner.leastCrowded": "Меньше толпы",
    "announcements.eyebrow": "Объявления и предупреждения",
    "announcements.title": "Живая лента оператора для транспортных инцидентов.",
    "operator.back": "Назад на главную",
    "operator.header": "Панель управления транспортом",
    "operator.events": "Импортированные события",
    "operator.actions": "Действия оператора",
  },
};

type I18nContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "az";
    }

    const storedLanguage = window.localStorage.getItem("azcon-flowai-language");
    return storedLanguage === "en" || storedLanguage === "ru" ? storedLanguage : "az";
  });

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("azcon-flowai-language", language);
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key: string) => dictionaries[language][key] ?? dictionaries.en[key] ?? key,
    }),
    [language],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
