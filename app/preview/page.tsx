// Preview page — mock data, no Supabase needed, no auth
import { ProjectCard, ProjectAlerts } from "@/components/project-card";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, daysUntil, getUrgencyLevel, getUrgencyColor, getUrgencyLabel, cn } from "@/lib/utils";
import { Plus, TrendingUp, Users, Music } from "lucide-react";
import { AlertEmblem, SealEmblem } from "@/components/emblems";
import type { Project, PipelineEntry } from "@/lib/types";

// Mock data based on real Borghini projects
const mockProjects: Project[] = [
  {
    id: "1", project_id: "ID 107", name: "TVEDESTRAND", type: "HJEMMESNEKK", status: "RELEASED",
    form_status: "Sendt releaseskjema", release_date: "2026-06-27", producer_id: null, producer_name: "BANTERS",
    price: 44, dropbox_link: null, audition: "", notes: "", tiktok_approved: true, spotify_sent: true,
    created_at: "2026-03-01", updated_at: "2026-06-27",
  },
  {
    id: "2", project_id: "ID 149", name: "SANDVIKA 2027", type: "HJEMMESNEKK", status: "FORBEREDELSE",
    form_status: "Sendt forberedelse", release_date: "2026-09-01", producer_id: null, producer_name: "BENJAMIN",
    price: 55, dropbox_link: null, audition: "", notes: "Session 24+25 juni, Julia / Selma",
    tiktok_approved: false, spotify_sent: false, created_at: "2026-05-01", updated_at: "2026-06-28",
  },
  {
    id: "3", project_id: "ID 108", name: "FANA 2027", type: "HJEMMESNEKK", status: "WIP",
    form_status: "Sendt releaseskjema", release_date: "2026-08-14", producer_id: null, producer_name: "TORMOD",
    price: 50, dropbox_link: null, audition: "2000,- digital audition", notes: "Session 11-12 april",
    tiktok_approved: false, spotify_sent: false, created_at: "2026-04-01", updated_at: "2026-06-28",
  },
  {
    id: "4", project_id: "ID 117", name: "JESSHEIM 2027", type: "3 SNEKKERE + ARTISTLÅT", status: "WIP",
    form_status: "Sendt releaseskjema", release_date: "2026-09-20", producer_id: null, producer_name: "BENJAMIN",
    price: 135, dropbox_link: null, audition: "Tilbud", notes: "Session 29 april + 6 mai",
    tiktok_approved: false, spotify_sent: false, created_at: "2026-04-01", updated_at: "2026-06-28",
  },
  {
    id: "5", project_id: "ID 167", name: "STAVANGER 2027", type: "BORGHINI SNEKK", status: "IKKE BEGYNT",
    form_status: "Ikke sendt", release_date: "2026-08-14", producer_id: null, producer_name: "BANTERS",
    price: 65, dropbox_link: null, audition: "INKLUDERT", notes: "Session 25+26 juli",
    tiktok_approved: false, spotify_sent: false, created_at: "2026-06-01", updated_at: "2026-06-28",
  },
  {
    id: "6", project_id: "ID 129", name: "DRAMMENSJENTENE 2027", type: "BORGHINI SNEKK", status: "IKKE BEGYNT",
    form_status: "Ikke sendt", release_date: "2026-09-25", producer_id: null, producer_name: "BANTERS",
    price: 65, dropbox_link: null, audition: "5000,- AVBRYTELSE", notes: "Amelie/Dorota/Henriette",
    tiktok_approved: false, spotify_sent: false, created_at: "2026-06-01", updated_at: "2026-06-28",
  },
];

const mockPipeline: PipelineEntry[] = [
  { id: "p1", group_name: "Oline - Asker 2027", contact_person: "", phone: "482 85 400", interested_in: "SNEKK", group_size: 21, budget: "", meeting_date: null, status: "Tilbud sendt", deadline: "2026-03-16", notes: null, created_at: "2026-01-15" },
  { id: "p2", group_name: "JANEIRO", contact_person: "", phone: "", interested_in: null, group_size: 0, budget: "35k", meeting_date: null, status: "Tilbud sendt", deadline: "2026-01-27", notes: null, created_at: "2026-01-10" },
  { id: "p3", group_name: "OSLO BOYSA", contact_person: "MATS", phone: "45428760", interested_in: "EP/SNEKK", group_size: 11, budget: "35k", meeting_date: null, status: "Kontaktet", deadline: null, notes: null, created_at: "2026-06-20" },
  { id: "p4", group_name: "MISSIONARY HALDEN 2027", contact_person: "ADA", phone: "90256732", interested_in: null, group_size: 11, budget: "", meeting_date: null, status: "Kontaktet", deadline: null, notes: null, created_at: "2026-06-22" },
];

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  const activeProjects = mockProjects.filter(p => p.status !== "RELEASED");
  const releasedProjects = mockProjects.filter(p => p.status === "RELEASED");
  const criticalProjects = activeProjects.filter(p => {
    const days = daysUntil(p.release_date);
    return days !== null && days <= 14;
  });

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
        <div className="flex items-center gap-2 bg-gold text-black font-medium px-4 py-2.5 rounded-lg text-sm">
          <Plus size={18} />
          Nytt prosjekt
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Music size={20} />} label="Aktive prosjekter" value={activeProjects.length} color="text-gold" />
        <StatCard icon={<TrendingUp size={20} />} label="Pipeline leads" value={mockPipeline.length} color="text-blue-400" />
        <StatCard icon={<AlertEmblem size={20} />} label="Haster (≤14d)" value={criticalProjects.length} color="text-danger" />
        <StatCard icon={<Users size={20} />} label="Aktive produsenter" value={16} color="text-emerald-400" />
      </div>

      {/* Alerts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertEmblem size={18} className="text-gold" />
          Varsler
        </h2>
        <ProjectAlerts projects={mockProjects} />
      </div>

      {/* Active projects */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Aktive prosjekter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeProjects.map(project => (
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
            {releasedProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Preview badge */}
      <div className="fixed bottom-4 right-4 bg-gold/20 border border-gold/30 text-gold text-xs px-3 py-2 rounded-lg">
        PREVIEW MODE — mock data
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-5">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-dark-muted text-xs mt-1">{label}</p>
    </div>
  );
}
