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
    "hero.subtitle": "Ağıllı şəhər nəqliyyatı üçün AI əsaslı sıxlıq proqnozu",
    "hero.cta.iticket": "EventFlow-a bax",
    "hero.cta.operator": "Demo başlat",
    "about.eyebrow": "AzCon FlowAI",
    "about.title":
      "Nəqliyyat və rabitəni vahid sistem kimi görən ağıllı şəhər proqnoz platforması",
    "about.p1":
      "FlowAI iTicket tədbir məlumatlarını oxuyur, tədbirin miqyasını və yerləşməsini analiz edir. Bu məlumatlar əsasında sərnişin axınının böyüklüyünü və istiqamətini proqnozlaşdırır, metro və avtobus sistemlərinə gözlənilən təsiri hesablayır.",
    "about.p2":
      "Sistem iş axarını belə qurur: tədbir məlumatları toplanır → AI analizi aparılır → sıxlıq proqnozu yaradılır → nəqliyyat marşrutları optimallaşdırılır. Nəticələr həm operatorlar üçün əməliyyat qərarları, həm də sərnişinlər üçün marşrut tövsiyələri şəklində təqdim olunur.",
    "about.p3":
      "Platforma tıxacların yaranmasının qarşısını almağa, sərnişinləri alternativ marşrutlarla yönləndirməyə və nəqliyyat operatorlarına real vaxtda qərar dəstəyi verməyə kömək edir.",
    "about.feature1.title": "AI Analiz",
    "about.feature1.desc": "Tədbir miqyası və yerləşmə əsasında sərnişin axınını proqnozlaşdırır",
    "about.feature2.title": "Nəqliyyat Optimizasiyası",
    "about.feature2.desc": "Metro və avtobus marşrutlarını sıxlığa görə tənzimləyir",
    "about.feature3.title": "Ağıllı Marşrut Tövsiyəsi",
    "about.feature3.desc": "İstifadəçilərə ən sürətli və az sıxlıqlı yolu təqdim edir",
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
    "import.eyebrow": "Event link import demo",
    "import.sectionTitle": "Tədbir linkini import et",
    "import.sectionBody": "İstifadəçilər və operatorlar tədbir linki yapışdıraraq event məlumatlarının avtomatik çıxarılmasını simulyasiya edə bilərlər. Bu demo import qatı real scraping olmadan mock məlumatlar istifadə edir.",
    "import.body":
      "FlowAI-nin tədbir səhifəsini nəqliyyat proqnoz məlumatına necə çevirdiyini simulyasiya etmək üçün istənilən tədbir linkini daxil edin. Bu demo mock parsing istifadə edir; real scraping hələ tətbiq olunmayıb.",
    "import.button": "Tədbiri analiz et",
    "import.idle": "Demo import üçün tədbir linkini daxil edin.",
    "import.reading": "AI tədbir məlumatlarını oxuyur...",
    "import.extracting": "AI tədbir detallarını çıxarır...",
    "import.complete": "Demo tədbir detalları çıxarıldı.",
    "planner.eyebrow": "Marşrut planlayıcısı",
    "planner.title": "Sərnişin marşrutları izdihamı əvvəlcədən görür",
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
    "notifications.title": "Bildirişlər",
    "notifications.activeCount": "aktiv",
    "notifications.totalCount": "ümumi",
    "notifications.filter.all": "Hamısı",
    "notifications.filter.active": "Aktiv",
    "notifications.filter.resolved": "Həll edildi",
    "notifications.markAllRead": "Hamısını oxunmuş et",
    "notifications.close": "Bağla",
    "notifications.empty": "Bildiriş tapılmadı",
    "notifications.viewAll": "Bütün bildirişləri gör",
    "notifications.status.active": "Aktiv",
    "notifications.status.monitoring": "İzlənir",
    "notifications.status.resolved": "Həll edildi",
    "notifications.status.scheduled": "Planlaşdırılmış",
    "alert.metro.crowding.title": "28 Mayda platforma sıxlığı",
    "alert.metro.crowding.desc": "Tədbir çıxış dalğaları üst-üstə düşdüyü üçün şimal istiqamətli platformada sərnişin sıxlığı artır.",
    "alert.road.restriction.title": "Sahilboyu yolda zolaq məhdudiyyəti",
    "alert.road.restriction.desc": "Bakı Crystal Hall yaxınlığında bir zolaq tədbir təhlükəsizliyi və servis avtobusları üçün məhdudlaşdırılıb.",
    "alert.bus.diversion.title": "88 nömrəli marşrut müvəqqəti yönləndirilib",
    "alert.bus.diversion.desc": "BakuBus 88 nömrəli marşrutu Sahil yaxınlığındakı müvəqqəti tədbir dayanacağından keçir.",
    "alert.crowd.warning.title": "Yüksək sərnişin axını gözlənilir",
    "alert.crowd.warning.desc": "Caspian Sound Festival çıxış axını 21:45-23:00 arasında zirvəyə çatacağı proqnozlaşdırılır.",
    "alert.tech.restored.title": "Ekran sinxronizasiyası bərpa edildi",
    "alert.tech.restored.desc": "Gənclik stansiyasında sərnişin məlumat ekranları qısa sinxronizasiya gecikməsindən sonra onlayndadır.",
    "location.28may": "28 May metro stansiyası",
    "location.crystal.corridor": "Bakı Crystal Hall dəhlizi",
    "location.route88.sahil": "88 nömrəli marşrut / Sahil",
    "location.crystal.hall": "Bakı Crystal Hall",
    "location.ganclik": "Gənclik metro stansiyası",
    "footer.tagline": "Ağıllı mobillik proqnozu",
    "footer.subtagline": "AI əsaslı nəqliyyat proqnoz platforması",
    "footer.copyright": "© 2026 AzCon FlowAI. Bütün hüquqlar qorunur.",
    "footer.link.about": "Haqqında",
    "footer.link.eventflow": "EventFlow",
    "footer.link.impact": "Təsir",
    "footer.link.planner": "Marşrut",
    "footer.link.operator": "Operator",
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
    "hero.subtitle": "AI-powered congestion forecasting for smart urban mobility",
    "hero.cta.iticket": "Explore EventFlow",
    "hero.cta.operator": "Start demo",
    "about.eyebrow": "AzCon FlowAI",
    "about.title":
      "A smart city prediction platform for transport and communications as one system",
    "about.p1":
      "FlowAI reads iTicket event data, analyzing event scale and venue location. Based on this data, it forecasts passenger flow volume and direction, calculating the expected impact on metro and bus systems.",
    "about.p2":
      "The system workflow: event data collection → AI analysis → congestion prediction → transport route optimization. Results are delivered as operational decisions for operators and route recommendations for passengers.",
    "about.p3":
      "The platform helps prevent congestion before it forms, redirects passengers via alternative routes, and provides real-time decision support for transport operators.",
    "about.feature1.title": "AI Analysis",
    "about.feature1.desc": "Forecasts passenger flow based on event scale and venue location",
    "about.feature2.title": "Transport Optimization",
    "about.feature2.desc": "Adjusts metro and bus routes based on predicted congestion",
    "about.feature3.title": "Smart Route Recommendation",
    "about.feature3.desc": "Provides users with the fastest and least crowded routes",
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
    "import.eyebrow": "Event link import demo",
    "import.sectionTitle": "Import event link",
    "import.sectionBody": "Users and operators can simulate automatic extraction of event data by pasting an event link. This demo import layer uses mock data without real scraping.",
    "import.body":
      "Paste any event URL to simulate how FlowAI would turn an event page into transport prediction data. This demo uses mock parsing; no real scraping is implemented yet.",
    "import.button": "Analyze Event",
    "import.idle": "Paste an event link to run the demo importer.",
    "import.reading": "Reading event data...",
    "import.extracting": "AI is extracting event details...",
    "import.complete": "Demo event details extracted.",
    "planner.eyebrow": "Route planner",
    "planner.title": "Passenger routes predict crowds before they happen",
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
    "notifications.title": "Notifications",
    "notifications.activeCount": "active",
    "notifications.totalCount": "total",
    "notifications.filter.all": "All",
    "notifications.filter.active": "Active",
    "notifications.filter.resolved": "Resolved",
    "notifications.markAllRead": "Mark all as read",
    "notifications.close": "Close",
    "notifications.empty": "No notifications found",
    "notifications.viewAll": "View all notifications",
    "notifications.status.active": "Active",
    "notifications.status.monitoring": "Monitoring",
    "notifications.status.resolved": "Resolved",
    "notifications.status.scheduled": "Scheduled",
    "alert.metro.crowding.title": "Platform crowding at 28 May",
    "alert.metro.crowding.desc": "Passenger density is rising on the northbound platform after overlapping event exit waves.",
    "alert.road.restriction.title": "Coastal road lane restriction",
    "alert.road.restriction.desc": "One lane near Baku Crystal Hall is restricted for event security and shuttle staging.",
    "alert.bus.diversion.title": "Route 88 temporary diversion",
    "alert.bus.diversion.desc": "BakuBus Route 88 is redirected through the temporary event stop near Sahil.",
    "alert.crowd.warning.title": "High crowd release expected",
    "alert.crowd.warning.desc": "Caspian Sound Festival exit flow is forecast to peak between 21:45 and 23:00.",
    "alert.tech.restored.title": "Display board sync restored",
    "alert.tech.restored.desc": "Passenger information displays at Gənclik are back online after a short data sync delay.",
    "location.28may": "28 May Metro Station",
    "location.crystal.corridor": "Baku Crystal Hall corridor",
    "location.route88.sahil": "Route 88 / Sahil",
    "location.crystal.hall": "Baku Crystal Hall",
    "location.ganclik": "Gənclik Metro Station",
    "footer.tagline": "Smart mobility prediction",
    "footer.subtagline": "AI-powered transport forecast platform",
    "footer.copyright": "© 2026 AzCon FlowAI. All rights reserved.",
    "footer.link.about": "About",
    "footer.link.eventflow": "EventFlow",
    "footer.link.impact": "Impact",
    "footer.link.planner": "Planner",
    "footer.link.operator": "Operator",
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
    "hero.subtitle": "Прогнозирование пробок на основе ИИ для умной городской мобильности",
    "hero.cta.iticket": "Открыть EventFlow",
    "hero.cta.operator": "Запустить демо",
    "about.eyebrow": "AzCon FlowAI",
    "about.title":
      "Прогнозная платформа умного города для транспорта и связи как единой системы",
    "about.p1":
      "FlowAI считывает данные мероприятий iTicket, анализируя масштаб и местоположение события. На основе этих данных прогнозирует объем и направление пассажиропотока, рассчитывая ожидаемое влияние на системы метро и автобусов.",
    "about.p2":
      "Рабочий процесс системы: сбор данных о мероприятии → AI-анализ → прогнозирование заторов → оптимизация транспортных маршрутов. Результаты представляются в виде операционных решений для операторов и рекомендаций по маршрутам для пассажиров.",
    "about.p3":
      "Платформа помогает предотвращать заторы до их возникновения, перенаправлять пассажиров по альтернативным маршрутам и обеспечивать поддержку принятия решений в реальном времени для транспортных операторов.",
    "about.feature1.title": "AI-анализ",
    "about.feature1.desc": "Прогнозирует пассажиропоток на основе масштаба и местоположения события",
    "about.feature2.title": "Оптимизация транспорта",
    "about.feature2.desc": "Корректирует маршруты метро и автобусов на основе прогнозируемых заторов",
    "about.feature3.title": "Умная рекомендация маршрутов",
    "about.feature3.desc": "Предоставляет пользователям самые быстрые и свободные от заторов маршруты",
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
    "import.eyebrow": "Демо импорта ссылки события",
    "import.sectionTitle": "Импорт ссылки события",
    "import.sectionBody": "Пользователи и операторы могут имитировать автоматическое извлечение данных о событии, вставив ссылку. Это демо использует mock-данные без реального скрапинга.",
    "import.body":
      "Вставьте любую ссылку на событие, чтобы смоделировать преобразование страницы события в транспортный прогноз. В демо используется mock parsing; реальный scraping пока не реализован.",
    "import.button": "Анализировать событие",
    "import.idle": "Вставьте ссылку на событие для демо импорта.",
    "import.reading": "Чтение данных события...",
    "import.extracting": "AI извлекает детали события...",
    "import.complete": "Демо-данные события извлечены.",
    "planner.eyebrow": "Планировщик маршрута",
    "planner.title": "Пассажирские маршруты предвидят скопление людей",
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
    "notifications.title": "Уведомления",
    "notifications.activeCount": "активных",
    "notifications.totalCount": "всего",
    "notifications.filter.all": "Все",
    "notifications.filter.active": "Активные",
    "notifications.filter.resolved": "Решено",
    "notifications.markAllRead": "Отметить все прочитанными",
    "notifications.close": "Закрыть",
    "notifications.empty": "Уведомлений не найдено",
    "notifications.viewAll": "Показать все уведомления",
    "notifications.status.active": "Активно",
    "notifications.status.monitoring": "Мониторинг",
    "notifications.status.resolved": "Решено",
    "notifications.status.scheduled": "Запланировано",
    "alert.metro.crowding.title": "Скопление на платформе 28 Мая",
    "alert.metro.crowding.desc": "Плотность пассажиров растет на северной платформе из-за пересечения волн выхода с мероприятий.",
    "alert.road.restriction.title": "Ограничение полосы на побережье",
    "alert.road.restriction.desc": "Одна полоса у Crystal Hall ограничена для обеспечения безопасности мероприятия и размещения автобусов.",
    "alert.bus.diversion.title": "Временное изменение маршрута 88",
    "alert.bus.diversion.desc": "Маршрут 88 перенаправлен через временную остановку мероприятия у Сахил.",
    "alert.crowd.warning.title": "Ожидается высокий пассажиропоток",
    "alert.crowd.warning.desc": "Выходной поток Caspian Sound Festival достигнет пика между 21:45 и 23:00.",
    "alert.tech.restored.title": "Синхронизация экранов восстановлена",
    "alert.tech.restored.desc": "Информационные экраны на станции Гянджлик снова в сети после кратковременной задержки синхронизации.",
    "location.28may": "Станция метро 28 Мая",
    "location.crystal.corridor": "Коридор Crystal Hall",
    "location.route88.sahil": "Маршрут 88 / Сахил",
    "location.crystal.hall": "Crystal Hall",
    "location.ganclik": "Станция метро Гянджлик",
    "footer.tagline": "Прогноз умной мобильности",
    "footer.subtagline": "Платформа прогнозирования транспорта на основе ИИ",
    "footer.copyright": "© 2026 AzCon FlowAI. Все права защищены.",
    "footer.link.about": "О платформе",
    "footer.link.eventflow": "EventFlow",
    "footer.link.impact": "Влияние",
    "footer.link.planner": "Маршрут",
    "footer.link.operator": "Оператор",
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
