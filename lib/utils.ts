import { differenceInDays, format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | null): string {
  if (!date) return "Ikke satt";
  try {
    return format(parseISO(date), "d. MMM yyyy", { locale: nb });
  } catch {
    return date;
  }
}

export function formatShortDate(date: string | null): string {
  if (!date) return "—";
  try {
    return format(parseISO(date), "dd.MM.yyyy", { locale: nb });
  } catch {
    return date;
  }
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  try {
    return differenceInDays(parseISO(date), new Date());
  } catch {
    return null;
  }
}

export function urgencyScore(project: {
  release_date: string | null;
  status: string;
  tiktok_approved: boolean;
}): number {
  const days = daysUntil(project.release_date);
  if (days === null) return 999; // No date = lowest priority
  if (project.status === "RELEASED") return 1000;
  if (days < 0) return days; // Overdue = highest priority (negative = top)
  if (days <= 7 && !project.tiktok_approved) return days - 100; // Critical
  if (days <= 14) return days - 50; // High
  return days; // Normal
}

export function getUrgencyLevel(project: {
  release_date: string | null;
  status: string;
  tiktok_approved: boolean;
}): "critical" | "high" | "medium" | "low" | "done" {
  if (project.status === "RELEASED") return "done";
  const days = daysUntil(project.release_date);
  if (days === null) return "low";
  if (days < 0) return "critical";
  if (days <= 7 && !project.tiktok_approved) return "critical";
  if (days <= 14) return "high";
  if (days <= 30) return "medium";
  return "low";
}

export function getUrgencyColor(level: ReturnType<typeof getUrgencyLevel>): string {
  switch (level) {
    case "critical": return "text-danger";
    case "high": return "text-warning";
    case "medium": return "text-gold";
    case "low": return "text-dark-muted";
    case "done": return "text-success";
  }
}

export function getUrgencyLabel(level: ReturnType<typeof getUrgencyLevel>): string {
  switch (level) {
    case "critical": return "Kritisk";
    case "high": return "Haster";
    case "medium": return "Snart";
    case "low": return "Tidlig";
    case "done": return "Utgitt";
  }
}

export function generateProjectId(existing: string[]): string {
  const maxNum = existing.reduce((max, id) => {
    const match = id.match(/ID (\d+)/);
    if (match) return Math.max(max, parseInt(match[1]));
    return max;
  }, 170);
  return `ID ${maxNum + 1}`;
}

export function timeAgo(date: string): string {
  try {
    const d = parseISO(date);
    const now = new Date();
    const diffDays = differenceInDays(now, d);
    if (diffDays === 0) return "I dag";
    if (diffDays === 1) return "I går";
    if (diffDays < 7) return `${diffDays} dager siden`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
    return `${Math.floor(diffDays / 30)} måneder siden`;
  } catch {
    return date;
  }
}
