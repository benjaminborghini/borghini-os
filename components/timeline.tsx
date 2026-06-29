"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import { MILESTONE_EMBLEMS, ReleaseStarEmblem } from "@/components/emblems";
import { AlertEmblem } from "@/components/emblems";
import type { Milestone } from "@/lib/types";

export function Timeline({ projectId, releaseDate }: { projectId: string; releaseDate: string | null }) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchMilestones();
  }, []);

  async function fetchMilestones() {
    const { data } = await supabase
      .from("milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    setMilestones(data || []);
    setLoading(false);
  }

  async function toggleMilestone(id: string, completed: boolean) {
    await supabase.from("milestones").update({ completed: !completed }).eq("id", id);
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, completed: !completed } : m)));
  }

  if (loading) return <div className="text-dark-muted text-sm">Laster...</div>;
  if (milestones.length === 0)
    return (
      <p className="text-dark-muted text-sm">
        Ingen milepæler. {releaseDate ? "Milepæler genereres fra slippdato." : "Sett en slippdato for å generere milepæler."}
      </p>
    );

  return (
    <div className="space-y-0">
      {milestones.map((m, i) => {
        const days = daysUntil(m.due_date);
        const isOverdue = days !== null && days < 0 && !m.completed;
        const isSoon = days !== null && days >= 0 && days <= 7 && !m.completed;
        const Emblem = MILESTONE_EMBLEMS[m.category] || ReleaseStarEmblem;

        return (
          <div key={m.id} className="flex gap-4 group">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => toggleMilestone(m.id, m.completed)}
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all z-10",
                  m.completed
                    ? "bg-gold border-gold text-black"
                    : isOverdue
                    ? "border-danger text-danger"
                    : isSoon
                    ? "border-warning text-warning"
                    : "border-dark-border text-dark-muted hover:border-gold/50 hover:text-gold/50"
                )}
              >
                {m.completed ? (
                  <Emblem size={16} />
                ) : isOverdue ? (
                  <AlertEmblem size={14} />
                ) : (
                  <Emblem size={16} className="opacity-40" />
                )}
              </button>
              {i < milestones.length - 1 && (
                <div className={cn(
                  "w-0.5 h-full min-h-[2rem] -mt-1",
                  m.completed ? "bg-gold/50" : "bg-dark-border"
                )} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cn(
                    "text-sm font-medium",
                    m.completed ? "text-dark-muted line-through" : "text-white"
                  )}>
                    {m.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "text-xs",
                      m.completed ? "text-success" : isOverdue ? "text-danger" : isSoon ? "text-warning" : "text-dark-muted"
                    )}>
                      {formatDate(m.due_date)}
                    </span>
                    {!m.completed && days !== null && (
                      <span className={cn(
                        "text-xs",
                        days < 0 ? "text-danger" : days <= 7 ? "text-warning" : "text-dark-muted"
                      )}>
                        ({days < 0 ? `${days * -1}d forsinket` : `${days}d igjen`})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
