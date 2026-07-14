import { createClient } from "@/lib/supabase/server";
import { formatDate, daysUntil } from "@/lib/utils";
import Link from "next/link";
import { Plus, Phone, Clock } from "lucide-react";
import type { PipelineEntry } from "@/lib/types";
import { PIPELINE_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  "Ny lead": "bg-blue-950 text-blue-400",
  "Kontaktet": "bg-indigo-950 text-indigo-400",
  "Møte booket": "bg-cyan-950 text-cyan-400",
  "Tilbud sendt": "bg-amber-950 text-amber-400",
  "Signert": "bg-emerald-950 text-emerald-400",
  "Avlyst": "bg-red-950 text-red-400",
  "Ikke interessert": "bg-zinc-800 text-zinc-500",
};

export default async function PipelinePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("pipeline")
    .select("*")
    .order("created_at", { ascending: false });

  const entries: PipelineEntry[] = data || [];

  // Group by status
  const grouped: Record<string, PipelineEntry[]> = {};
  for (const s of PIPELINE_STATUSES) {
    grouped[s] = entries.filter((e) => e.status === s);
  }

  const activeStatuses = PIPELINE_STATUSES.filter(
    (s) => !["Avlyst", "Ikke interessert"].includes(s)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-dark-muted text-sm mt-1">
            {entries.filter((e) => !["Signert","Avlyst","Ikke interessert"].includes(e.status)).length} aktive leads
          </p>
        </div>
      </div>

      {/* Kanban-style columns — horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-2 scroll-touch lg:grid lg:grid-cols-5 lg:overflow-visible">
        {activeStatuses.map((status) => (
          <div key={status} className="space-y-3 min-w-[280px] lg:min-w-0 flex-shrink-0 lg:flex-shrink">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/80">{status}</h3>
              <span className="text-xs text-dark-muted bg-dark-card px-2 py-0.5 rounded">
                {grouped[status]?.length || 0}
              </span>
            </div>
            <div className="space-y-2">
              {(grouped[status] || []).map((entry) => {
                const days = daysUntil(entry.deadline);
                return (
                  <div
                    key={entry.id}
                    className="bg-dark-card border border-dark-border rounded-xl p-4 hover:border-gold/20 transition-colors"
                  >
                    <p className="font-medium text-white text-sm">{entry.group_name}</p>
                    {entry.contact_person && (
                      <p className="text-xs text-dark-muted mt-1">{entry.contact_person}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {entry.budget && (
                        <span className="text-xs text-gold">{entry.budget}</span>
                      )}
                      {entry.group_size && entry.group_size > 0 && (
                        <span className="text-xs text-dark-muted">{entry.group_size} pers</span>
                      )}
                      {entry.interested_in && (
                        <span className="text-xs text-dark-muted">{entry.interested_in}</span>
                      )}
                    </div>
                    {entry.phone && (
                      <a href={`tel:${entry.phone}`} className="text-xs text-gold flex items-center gap-1 mt-2">
                        <Phone size={12} /> {entry.phone}
                      </a>
                    )}
                    {entry.deadline && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <Clock size={12} className="text-dark-muted" />
                        <span className={days !== null && days < 0 ? "text-danger" : days !== null && days <= 3 ? "text-warning" : "text-dark-muted"}>
                          {formatDate(entry.deadline)}
                          {days !== null && days >= 0 && ` (${days}d)`}
                          {days !== null && days < 0 && ` (forbi)`}
                        </span>
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-xs text-white/60 mt-2">{entry.notes}</p>
                    )}
                  </div>
                );
              })}
              {(!grouped[status] || grouped[status].length === 0) && (
                <div className="text-xs text-dark-muted text-center py-8 border border-dashed border-dark-border rounded-xl">
                  Ingen
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lost/Cancelled */}
      {(grouped["Avlyst"]?.length || grouped["Ikke interessert"]?.length) ? (
        <div>
          <h2 className="text-lg font-semibold text-white/60 mb-4">Tapt/Avlyst</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...(grouped["Avlyst"] || []), ...(grouped["Ikke interessert"] || [])].map((entry) => (
              <div key={entry.id} className="bg-dark-card border border-dark-border rounded-xl p-4 opacity-60">
                <p className="font-medium text-white text-sm">{entry.group_name}</p>
                <span className={`text-xs px-2 py-0.5 rounded mt-1 inline-block ${statusColors[entry.status]}`}>
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
