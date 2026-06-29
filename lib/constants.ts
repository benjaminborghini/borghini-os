import type { ProjectStatus, ProjectType, FormStatus, PipelineStatus } from "./types";

// === CONSTANTS ===

export const PROJECT_TYPES: ProjectType[] = [
  "HJEMMESNEKK",
  "BORGHINI SNEKK",
  "KONSEPTSNEKK",
  "PARTYSNEKK",
  "EP",
  "SINGEL",
  "ARTISTLÅT",
  "MANAGEMENT DEAL",
  "3 SNEKKERE + ARTISTLÅT",
];

export const PROJECT_STATUSES: ProjectStatus[] = [
  "IKKE BEGYNT",
  "WIP",
  "FORBEREDELSE",
  "SESSION BOOKET",
  "DEMO SENDT",
  "FEEDBACK MOTTATT",
  "REVISJON",
  "GODKJENT",
  "MASTERING",
  "SLUTTFØRING",
  "RELEASED",
];

export const FORM_STATUSES: FormStatus[] = [
  "Ikke sendt",
  "Sendt forberedelse",
  "Sendt releaseskjema",
  "Godkjent",
];

export const PIPELINE_STATUSES: PipelineStatus[] = [
  "Ny lead",
  "Kontaktet",
  "Møte booket",
  "Tilbud sendt",
  "Signert",
  "Avlyst",
  "Ikke interessert",
];

// === STATUS COLORS ===

export const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  "IKKE BEGYNT": { bg: "bg-zinc-800", text: "text-zinc-400", dot: "bg-zinc-500" },
  "WIP": { bg: "bg-blue-950", text: "text-blue-400", dot: "bg-blue-500" },
  "FORBEREDELSE": { bg: "bg-indigo-950", text: "text-indigo-400", dot: "bg-indigo-500" },
  "SESSION BOOKET": { bg: "bg-cyan-950", text: "text-cyan-400", dot: "bg-cyan-500" },
  "DEMO SENDT": { bg: "bg-purple-950", text: "text-purple-400", dot: "bg-purple-500" },
  "FEEDBACK MOTTATT": { bg: "bg-amber-950", text: "text-amber-400", dot: "bg-amber-500" },
  "REVISJON": { bg: "bg-orange-950", text: "text-orange-400", dot: "bg-orange-500" },
  "GODKJENT": { bg: "bg-emerald-950", text: "text-emerald-400", dot: "bg-emerald-500" },
  "MASTERING": { bg: "bg-teal-950", text: "text-teal-400", dot: "bg-teal-500" },
  "SLUTTFØRING": { bg: "bg-yellow-950", text: "text-yellow-400", dot: "bg-yellow-500" },
  "RELEASED": { bg: "bg-green-950", text: "text-green-400", dot: "bg-green-500" },
};

// === MILESTONE TEMPLATES ===

export interface MilestoneTemplate {
  title: string;
  daysBefore: number; // days before release_date
  category: string;
}

export const MILESTONE_TEMPLATES: MilestoneTemplate[] = [
  { title: "Utkast sendt (runde 1)", daysBefore: 42, category: "utkast" },
  { title: "Revisjon 1", daysBefore: 35, category: "revisjon" },
  { title: "Revisjon 2", daysBefore: 28, category: "revisjon" },
  { title: "TikTok-lyd godkjent", daysBefore: 28, category: "tiktok" },
  { title: "Låta ferdig (mastering)", daysBefore: 21, category: "mastering" },
  { title: "Promo starter (TikTok)", daysBefore: 28, category: "promo" },
  { title: "Slipp!", daysBefore: 0, category: "release" },
];

// === SLUTTFØRING CHECKLIST ===

export const SLUTTFORING_STEPS = [
  "Sendt til godkjennelse",
  "Godkjent",
  "Master",
  "Artwork",
  "Labelcopy",
  "TikTok timeframe",
  "Releasedato satt",
];

// === NAV ITEMS ===

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "layout-dashboard" },
  { label: "Prosjekter", href: "/prosjekter", icon: "folder" },
  { label: "Pipeline", href: "/pipeline", icon: "trending-up" },
  { label: "Team", href: "/team", icon: "users" },
  { label: "Innstillinger", href: "/innstillinger", icon: "settings" },
];

// === DEMO LINK EXPIRY ===

export const DEMO_LINK_DURATION_DAYS = 7;
