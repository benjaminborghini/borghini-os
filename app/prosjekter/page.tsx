import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/project-card";
import { urgencyScore } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { status?: string; type?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("projects")
    .select(`*, producers(name)`)
    .order("created_at", { ascending: false });

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.type && searchParams.type !== "all") {
    query = query.eq("type", searchParams.type);
  }

  const { data } = await query;

  const projects: Project[] = (data || []).map((p: any) => ({
    ...p,
    producer_name: p.producers?.name,
  }));

  const sorted = [...projects].sort((a, b) => urgencyScore(a) - urgencyScore(b));

  const statuses = [
    "all", "IKKE BEGYNT", "WIP", "FORBEREDELSE", "SESSION BOOKET",
    "DEMO SENDT", "FEEDBACK MOTTATT", "REVISJON", "GODKJENT",
    "MASTERING", "SLUTTFØRING", "RELEASED"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Prosjekter</h1>
          <p className="text-dark-muted text-sm mt-1">{sorted.length} totalt</p>
        </div>
        <Link
          href="/prosjekter/ny"
          className="flex items-center gap-2 bg-gold text-black font-medium px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          <Plus size={18} />
          Nytt prosjekt
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/prosjekter?status=${s}`}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
              (searchParams.status || "all") === s
                ? "bg-gold text-black font-medium"
                : "bg-dark-card text-white/60 hover:text-white border border-dark-border"
            }`}
          >
            {s === "all" ? "Alle" : s}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <p className="text-dark-muted">Ingen prosjekter funnet.</p>
          <Link href="/prosjekter/ny" className="text-gold text-sm mt-2 inline-block hover:underline">
            Opprett ditt første prosjekt →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
