import {
  Activity,
  BellRing,
  BusFront,
  CalendarDays,
  CircleDot,
  Clock3,
  Gauge,
  LucideIcon,
  MapPin,
  RadioTower,
  Route,
  Sparkles,
  Ticket,
  TrainFront,
  Zap,
} from "lucide-react";

export type PredictionPoint = {
  time: string;
  metro: number;
  bus: number;
  baseline: number;
};

export type StatCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
};

export type WorkflowStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Announcement = {
  tone: "critical" | "warning" | "info";
  title: string;
  meta: string;
  body: string;
};

export type ITicketEvent = {
  name: string;
  location: string;
  dateTime: string;
  ticketCapacity: string;
  estimatedAttendance: string;
  nearbyMetroStations: string[];
  congestionLevel: "Critical" | "High" | "Moderate";
};

export const navItems = [
  { key: "about", label: "About", href: "#about" },
  { key: "iticket", label: "iTicket", href: "#iticket" },
  { key: "impact", label: "Impact", href: "#event-impact" },
  { key: "planner", label: "Planner", href: "#planner" },
  { key: "ops", label: "Ops", href: "/ops" },
];

export const predictionData: PredictionPoint[] = [
  { time: "16:00", metro: 38, bus: 31, baseline: 25 },
  { time: "17:00", metro: 57, bus: 44, baseline: 34 },
  { time: "18:00", metro: 84, bus: 71, baseline: 49 },
  { time: "19:00", metro: 94, bus: 88, baseline: 56 },
  { time: "20:00", metro: 76, bus: 73, baseline: 47 },
  { time: "21:00", metro: 52, bus: 49, baseline: 37 },
];

export const heroStats: StatCard[] = [
  {
    icon: Ticket,
    label: "iTicket signals",
    value: "128",
    detail: "events analyzed this week",
  },
  {
    icon: Gauge,
    label: "Forecast horizon",
    value: "6h",
    detail: "before congestion peaks",
  },
  {
    icon: RadioTower,
    label: "Ops alerts",
    value: "24/7",
    detail: "control-room readiness",
  },
];

export const aboutStats: StatCard[] = [
  {
    icon: TrainFront,
    label: "Metro intelligence",
    value: "+34%",
    detail: "projected pressure near event exits",
  },
  {
    icon: BusFront,
    label: "Bus capacity",
    value: "+27%",
    detail: "extra demand on feeder routes",
  },
  {
    icon: Activity,
    label: "Model target",
    value: "92%",
    detail: "forecast accuracy goal for demo data",
  },
];

export const workflowSteps: WorkflowStep[] = [
  {
    icon: CalendarDays,
    title: "Event pulse",
    description:
      "iTicket schedules, sales velocity, venue capacity, and gate timing become structured transport demand signals.",
  },
  {
    icon: Sparkles,
    title: "AI forecast layer",
    description:
      "FlowAI blends event demand with station, route, time-of-day, and historical crowd movement patterns.",
  },
  {
    icon: Zap,
    title: "Operational action",
    description:
      "Dispatchers receive route pressure, station risk, and recommended response windows before the crowd moves.",
  },
];

export const iTicketEvents: ITicketEvent[] = [
  {
    name: "Sea Breeze Summer Concert",
    location: "Sea Breeze Resort",
    dateTime: "26 Apr 2026 · 19:30",
    ticketCapacity: "22,000",
    estimatedAttendance: "18,400",
    nearbyMetroStations: ["Koroglu", "28 May", "Ganjlik"],
    congestionLevel: "Critical",
  },
  {
    name: "Baku Expo Tech Night",
    location: "Baku Expo Center",
    dateTime: "27 Apr 2026 · 18:00",
    ticketCapacity: "9,500",
    estimatedAttendance: "7,900",
    nearbyMetroStations: ["Koroglu", "Narimanov"],
    congestionLevel: "High",
  },
  {
    name: "City Arena Final",
    location: "Olympic Stadium",
    dateTime: "28 Apr 2026 · 20:45",
    ticketCapacity: "31,000",
    estimatedAttendance: "27,600",
    nearbyMetroStations: ["Koroglu", "Ulduz"],
    congestionLevel: "High",
  },
];

export const iTicketAnalysisMetrics = [
  { label: "Demand confidence", value: "91%" },
  { label: "Peak release", value: "21:05" },
  { label: "At-risk stations", value: "5" },
  { label: "Bus gap", value: "+14" },
];

export const suggestedActions = [
  {
    icon: TrainFront,
    title: "Reduce metro interval",
    detail: "Hold headway below 4 minutes from 20:40 to 21:30.",
  },
  {
    icon: BusFront,
    title: "Add temporary route",
    detail: "Open venue shuttle loop toward Koroglu and 28 May.",
  },
  {
    icon: Route,
    title: "Redirect passengers",
    detail: "Split outbound flow between metro, express bus, and rideshare zones.",
  },
  {
    icon: BellRing,
    title: "Notify users",
    detail: "Send crowd-aware route guidance before event exit wave.",
  },
];

export const dashboardMetrics = [
  { label: "Metro pressure", value: "94%", color: "bg-cyan-400" },
  { label: "Bus load", value: "88%", color: "bg-blue-500" },
  { label: "Venue release", value: "18:40", color: "bg-sky-300" },
  { label: "Alert level", value: "High", color: "bg-amber-400" },
];

export const routeStops = [
  { name: "28 May", load: "High", x: "10%", y: "68%" },
  { name: "Ganjlik", load: "Rising", x: "31%", y: "44%" },
  { name: "Koroglu", load: "Medium", x: "55%", y: "55%" },
  { name: "Sea Breeze", load: "Surge", x: "80%", y: "24%" },
];

export const announcements: Announcement[] = [
  {
    tone: "critical",
    title: "Concert release wave detected",
    meta: "19:05 · Sea Breeze corridor",
    body: "Ticket scan-out pattern indicates a 42-minute outbound crowd surge toward metro and express bus links.",
  },
  {
    tone: "warning",
    title: "Feeder route reinforcement",
    meta: "18:30 · Route 171 / 125",
    body: "Recommended dispatch window opened for additional buses and queue supervision at venue-side stops.",
  },
  {
    tone: "info",
    title: "Metro platform balancing",
    meta: "17:55 · 28 May interchange",
    body: "Passenger flow expected to normalize after 21:10 if train headways remain below four minutes.",
  },
];

export const plannerOptions = [
  { icon: Route, label: "Fastest", value: "42 min" },
  { icon: CircleDot, label: "Least crowded", value: "58 min" },
  { icon: MapPin, label: "Best transfer", value: "1 change" },
  { icon: Clock3, label: "Leave by", value: "17:24" },
];
