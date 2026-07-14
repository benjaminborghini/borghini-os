import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { AlertBanner } from "./alert-banner";
import { formatDate, daysUntil, getUrgencyLevel, getUrgencyColor, getUrgencyLabel, cn } from "@/lib/utils";
import { URGENCY_EMBLEMS, AlertEmblem } from "@/components/emblems";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const urgency = getUrgencyLevel(project);
  const days = daysUntil(project.release_date);
  const UrgencyEmblem = URGENCY_EMBLEMS[urgency];

  return (
    <Link href={`/prosjekter/${project.id}`} className="block group">
      <div
        className={cn(
          "bg-dark-card border rounded-xl p-5 transition-all hover:border-gold/30 hover:bg-dark-hover",
          urgency === "critical" ? "border-danger/30" : "border-dark-border"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs text-dark-muted font-mono">{project.project_id}</span>
              <span className="text-xs text-gold/60">{project.type}</span>
            </div>
            <h3 className="font-bold text-white truncate group-hover:text-gold transition-colors">
              {project.name}
            </h3>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="min-w-0">
            <p className="text-dark-muted text-xs mb-0.5">Slippdato</p>
            <p className={cn("font-medium truncate", getUrgencyColor(urgency))}>
              {formatDate(project.release_date)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-dark-muted text-xs mb-0.5">Nedtelling</p>
            <p className={cn("font-medium truncate", getUrgencyColor(urgency))}>
              {days === null ? "—" : days < 0 ? `${Math.abs(days)} dager forsinket` : `${days} dager`}
            </p>
          </div>
          {project.producer_name && (
            <div>
              <p className="text-dark-muted text-xs mb-0.5">Produsent</p>
              <p className="text-white/80 text-sm">{project.producer_name}</p>
            </div>
          )}
          {project.price && (
            <div>
              <p className="text-dark-muted text-xs mb-0.5">Pris</p>
              <p className="text-white/80 text-sm">{project.price}k</p>
            </div>
          )}
        </div>

        {/* Urgency label */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-y-2">
          <span className={cn("text-xs font-medium flex items-center gap-1.5", getUrgencyColor(urgency))}>
            <UrgencyEmblem size={14} />
            {getUrgencyLabel(urgency)}
          </span>
          {!project.tiktok_approved && project.status !== "RELEASED" && days !== null && days < 30 && (
            <span className="text-xs text-danger flex items-center gap-1">
              <AlertEmblem size={12} />
              TikTok ikke godkjent
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProjectAlerts({ projects }: { projects: Project[] }) {
  const alerts = projects
    .filter((p) => p.status !== "RELEASED")
    .map((p) => {
      const days = daysUntil(p.release_date);
      const urgency = getUrgencyLevel(p);
      return { project: p, days, urgency };
    })
    .filter((a) => a.urgency === "critical" || a.urgency === "high")
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999))
    .slice(0, 5);

  if (alerts.length === 0) {
    return (
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 text-center">
        <span className="text-success text-sm flex items-center justify-center gap-2">
            Alt under kontroll — ingen haster akkurat nå.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(({ project, days, urgency }) => (
        <AlertBanner
          key={project.id}
          severity={urgency === "critical" ? "critical" : "high"}
          title={`${project.project_id} — ${project.name}`}
          message={
            days !== null && days < 0
              ? `${Math.abs(days)} dager forsinket! Status: ${project.status}${!project.tiktok_approved ? " · TikTok ikke godkjent" : ""}`
              : `${days} dager til slipp${!project.tiktok_approved && days !== null && days < 30 ? " · TikTok ikke godkjent" : ""}. Status: ${project.status}`
          }
        />
      ))}
    </div>
  );
}
