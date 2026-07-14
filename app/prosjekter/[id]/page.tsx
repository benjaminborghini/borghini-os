import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Music, User, Phone, DollarSign, FileText } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Timeline } from "@/components/timeline";
import { Checklist } from "@/components/checklist";
import { FeedbackLog } from "@/components/feedback-log";
import { DemoLink } from "@/components/demo-link";
import { SealEmblem, AlertEmblem } from "@/components/emblems";
import { DropboxSection } from "@/components/dropbox-section";
import { formatDate, daysUntil, getUrgencyLevel, getUrgencyColor, getUrgencyLabel, cn } from "@/lib/utils";
import { FORM_STATUSES, SLUTTFORING_STEPS } from "@/lib/constants";
import type { Project, Contact, PreparationForm } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Fetch project with producer
  const { data: projectData } = await supabase
    .from("projects")
    .select(`*, producers(name)`)
    .eq("id", params.id)
    .single();

  if (!projectData) notFound();

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("project_id", params.id);

  const { data: prepForm } = await supabase
    .from("preparation_forms")
    .select("*")
    .eq("project_id", params.id)
    .maybeSingle();

  const project: Project = {
    ...projectData,
    producer_name: projectData.producers?.name,
  };

  const urgency = getUrgencyLevel(project);
  const days = daysUntil(project.release_date);

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link href="/prosjekter" className="inline-flex items-center gap-2 text-sm text-dark-muted hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Tilbake til prosjekter
      </Link>

      {/* Header */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-dark-muted font-mono">{project.project_id}</span>
              <span className="text-xs text-gold/60 bg-gold/10 px-2 py-0.5 rounded">{project.type}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm flex-wrap gap-y-1">
              <span className={getUrgencyColor(urgency)}>{getUrgencyLabel(urgency)}</span>
              {days !== null && (
                <span className="text-dark-muted">
                  {days < 0 ? `${Math.abs(days)} dager forsinket` : `${days} dager til slipp`}
                </span>
              )}
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info */}
          <Section title="Informasjon">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoRow icon={<CalendarIcon />} label="Slippdato" value={formatDate(project.release_date)} />
              <InfoRow icon={<User size={14} />} label="Produsent" value={project.producer_name || "Ikke tildelt"} />
              <InfoRow icon={<DollarSign size={14} />} label="Pris" value={project.price ? `${project.price}k` : "—"} />
              <InfoRow icon={<FileText size={14} />} label="Skjema" value={project.form_status || "Ikke sendt"} />
              {project.audition && (
                <InfoRow icon={<Music size={14} />} label="Audition" value={project.audition} />
              )}
              {project.dropbox_link && (
                <div className="sm:col-span-2">
                  <p className="text-dark-muted text-xs mb-1">Dropbox</p>
                  <a
                    href={project.dropbox_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-gold text-sm hover:underline"
                  >
                    <ExternalLink size={14} />
                    Åpne Dropbox-mappe
                  </a>
                </div>
              )}
              {project.notes && (
                 <div className="sm:col-span-2">
                  <p className="text-dark-muted text-xs mb-1">Notater</p>
                  <p className="text-white/80">{project.notes}</p>
                </div>
              )}
            </div>

            {/* Contacts */}
            {contacts && contacts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-dark-muted text-xs mb-2">Kontaktpersoner</p>
                <div className="space-y-2">
                  {contacts.map((c: Contact) => (
                    <div key={c.id} className="flex items-center gap-2 text-sm flex-wrap gap-y-1">
                      <span className="text-white/80">{c.name}</span>
                      <span className="text-xs text-dark-muted">· {c.role}</span>
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="text-gold text-xs flex items-center gap-1">
                          <Phone size={12} /> {c.phone}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Timeline */}
          <Section title="Tidslinje">
            <Timeline projectId={project.id} releaseDate={project.release_date} />
          </Section>

          {/* Sluttforing checklist (if applicable) */}
          {(project.status === "SLUTTFØRING" || project.status === "GODKJENT" || project.status === "MASTERING") && (
            <Section title="Sluttfølging">
              <div className="flex flex-wrap gap-2">
                {SLUTTFORING_STEPS.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm"
                  >
                    <span className="w-5 h-5 rounded-full border-2 border-dark-border flex items-center justify-center text-xs text-dark-muted">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right: Checklist + Demo + Feedback */}
        <div className="space-y-6">
          {/* Checklist */}
          <Section title="Intern sjekkliste">
            <Checklist projectId={project.id} />
          </Section>

          {/* Demo link */}
          <Section title="Låter & Demo">
            <DemoLink projectId={project.id} />
          </Section>

          {/* Dropbox */}
          <Section title="Dropbox">
            <DropboxSection projectId={project.id} dropboxLink={project.dropbox_link} projectName={project.name} />
          </Section>
        </div>
      </div>

      {/* Feedback log — full width */}
      <Section title="Feedback-log">
        <FeedbackLog projectId={project.id} />
      </Section>

      {/* Preparation form — if exists */}
      {prepForm && (
        <Section title="Forberedelsesskjema">
          <PrepFormView form={prepForm as PreparationForm} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="text-dark-muted text-xs mb-1 flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className="text-white/80">{value}</p>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PrepFormView({ form }: { form: PreparationForm }) {
  const fields = [
    { label: "Konseptnavn", value: form.concept_name },
    { label: "Hva navnet betyr", value: form.concept_meaning },
    { label: "Interne vitser/uttrykk", value: form.internal_jokes },
    { label: "Stil på beat", value: form.beat_style },
    { label: "Beat-beskrivelse", value: form.beat_description },
    { label: "Stil på tekst", value: form.text_style },
    { label: "Tekst-beskrivelse", value: form.text_description },
    { label: "Rap-mengde", value: form.rap_amount },
    { label: "Syng-mengde", value: form.sing_amount },
    { label: "Rap/syng notater", value: form.rap_sing_notes },
    { label: "Beatswitch viktighet", value: form.beatswitch_importance ? `${form.beatswitch_importance}/6` : null },
    { label: "Beatswitch beskrivelse", value: form.beatswitch_description },
    { label: "Live viktighet", value: form.live_importance ? `${form.live_importance}/6` : null },
    { label: "TikTok viktighet", value: form.tiktok_importance ? `${form.tiktok_importance}/6` : null },
    { label: "TikTok-forslag", value: form.tiktok_suggestion },
    { label: "Lydeffekter", value: form.sound_effects },
    { label: "Originalitet viktighet", value: form.originality_importance ? `${form.originality_importance}/6` : null },
    { label: "Referanser", value: form.reference_links },
    { label: "Glosebank — ord", value: form.glossary_words },
    { label: "Glosebank — setninger", value: form.glossary_phrases },
    { label: "Flere skisser/idéer", value: form.additional_ideas },
    { label: "Siste tanker", value: form.final_notes },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((f) => (
        f.value && (
          <div key={f.label}>
            <p className="text-dark-muted text-xs mb-1">{f.label}</p>
            <p className="text-white/80 text-sm whitespace-pre-wrap">{f.value}</p>
          </div>
        )
      ))}
    </div>
  );
}
