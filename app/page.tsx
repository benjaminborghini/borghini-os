import { createClient } from "@/lib/supabase/server";
import { ProjectCard, ProjectAlerts } from "@/components/project-card";
import { urgencyScore, daysUntil, getUrgencyLevel } from "@/lib/utils";
import Link from "next/link";
import { Plus, TrendingUp, Users, Music } from "lucide-react";
import { AlertEmblem, SealEmblem } from "@/components/emblems";
import type { Project, PipelineEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  // Fetch projects with producer names
  const { data: projectsData } = await supabase
    .from("projects")
    .select(`
      *,
      producers(name)
    `)
    .order("created_at", { ascending: false });

  const { data: pipelineData } = await supabase
    .from("pipeline")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: producersData } = await supabase
    .from("producers")
    .select("*")
    .eq("active", true);

  // Transform projects
  const projects: Project[] = (projectsData || []).map((p: any) => ({
    ...p,
    producer_name: p.producers?.name,
  }));

  // Sort by urgency
  const sortedProjects = [...projects].sort((a, b) => urgencyScore(a) - urgencyScore(b));

  // Stats
  const activeProjects = projects.filter((p) => p.status !== "RELEASED");
  const releasedProjects = projects.filter((p) => p.status === "RELEASED");
  const criticalProjects = activeProjects.filter((p) => {
    const days = daysUntil(p.release_date);
    return days !== null && days <= 14;
  });
  const pipelineCount = (pipelineData || []).filter(
    (p: PipelineEntry) => !["Signert", "Avlyst", "Ikke interessert"].includes(p.status)
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-muted text-sm mt-1">
            {activeProjects.length} aktive prosjekter · {releasedProjects.length} utgitt
          </p>
        </div>
        <Link
          href="/prosjekter/ny"
          className="flex items-center gap-2 bg-gold text-black font-medium px-4 py-2.5 rounded-lg hover:bg-gold-light transition-colors text-sm"
        >
          <Plus size={18} />
          Nytt prosjekt
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Music size={20} />}
          label="Aktive prosjekter"
          value={activeProjects.length}
          color="text-gold"
        />
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Pipeline leads"
          value={pipelineCount}
          color="text-blue-400"
        />
        <StatCard
          icon={<AlertEmblem size={20} />}
          label="Haster (≤14d)"
          value={criticalProjects.length}
          color="text-danger"
        />
        <StatCard
          icon={<Users size={20} />}
          label="Aktive produsenter"
          value={producersData?.length || 0}
          color="text-emerald-400"
        />
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertEmblem size={18} className="text-gold" />
          Varsler
        </h2>
        <ProjectAlerts projects={projects} />
      </div>

      {/* Active projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Aktive prosjekter</h2>
          <Link href="/prosjekter" className="text-gold text-sm hover:underline">
            Vis alle →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedProjects
            .filter((p) => p.status !== "RELEASED")
            .slice(0, 9)
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </div>

      {/* Released */}
      {releasedProjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <SealEmblem size={18} className="text-success" />
            Utgitt
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {releasedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-dark-muted text-xs mt-1">{label}</p>
    </div>
  );
}
