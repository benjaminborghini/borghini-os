"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { PROJECT_TYPES, PROJECT_STATUSES, FORM_STATUSES, MILESTONE_TEMPLATES } from "@/lib/constants";
import { generateProjectId } from "@/lib/utils";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Producer, Milestone } from "@/lib/types";

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [type, setType] = useState("HJEMMESNEKK");
  const [status, setStatus] = useState("IKKE BEGYNT");
  const [formStatus, setFormStatus] = useState("Ikke sendt");
  const [releaseDate, setReleaseDate] = useState("");
  const [producerId, setProducerId] = useState("");
  const [price, setPrice] = useState("");
  const [audition, setAudition] = useState("");
  const [notes, setNotes] = useState("");
  const [dropboxLink, setDropboxLink] = useState("");
  const [projectId, setProjectId] = useState("");
  const [producers, setProducers] = useState<Producer[]>([]);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [{ data: prodData }, { data: projData }] = await Promise.all([
      supabase.from("producers").select("*").eq("active", true).order("name"),
      supabase.from("projects").select("project_id"),
    ]);
    setProducers(prodData || []);
    const ids = (projData || []).map((p: any) => p.project_id);
    setExistingIds(ids);
    setProjectId(generateProjectId(ids));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: project, error: insertError } = await supabase
      .from("projects")
      .insert({
        project_id: projectId,
        name,
        type,
        status,
        form_status: formStatus,
        release_date: releaseDate || null,
        producer_id: producerId || null,
        price: price ? parseInt(price) : null,
        audition: audition || null,
        notes: notes || null,
        dropbox_link: dropboxLink || null,
        tiktok_approved: false,
        spotify_sent: false,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Generate milestones if release date is set
    if (releaseDate && project) {
      const release = new Date(releaseDate);
      const milestones = MILESTONE_TEMPLATES.map((t, i) => {
        const due = new Date(release);
        due.setDate(due.getDate() - t.daysBefore);
        return {
          project_id: project.id,
          title: t.title,
          due_date: due.toISOString().split("T")[0],
          completed: false,
          category: t.category,
          sort_order: i + 1,
        };
      });
      await supabase.from("milestones").insert(milestones);
    }

    router.push(`/prosjekter/${project.id}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link href="/prosjekter" className="inline-flex items-center gap-2 text-sm text-dark-muted hover:text-white transition-colors">
        <ArrowLeft size={16} />
        Tilbake til prosjekter
      </Link>

      <h1 className="text-2xl font-bold text-white">Nytt prosjekt</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project ID (auto) */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Prosjekt-ID</label>
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="w-full font-mono"
          />
          <p className="text-xs text-dark-muted mt-1">Auto-generert — kan endres</p>
        </div>

        {/* Group name */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Gruppenavn *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="F.eks. Oppegård 2027"
            className="w-full"
          />
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full">
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full">
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Form status + Release date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Skjema-status</label>
            <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full">
              {FORM_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Slippdato</label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Producer + Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Produsent</label>
            <select value={producerId} onChange={(e) => setProducerId(e.target.value)} className="w-full">
              <option value="">Ikke tildelt</option>
              {producers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-white/60 mb-2">Pris (i k)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="F.eks. 50"
              className="w-full"
            />
          </div>
        </div>

        {/* Audition */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Audition</label>
          <input
            type="text"
            value={audition}
            onChange={(e) => setAudition(e.target.value)}
            placeholder="F.eks. Tilbud, INKLUDERT, 2000,- DA"
            className="w-full"
          />
        </div>

        {/* Dropbox link */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Dropbox-lenke</label>
          <input
            type="url"
            value={dropboxLink}
            onChange={(e) => setDropboxLink(e.target.value)}
            placeholder="https://www.dropbox.com/..."
            className="w-full"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Notater</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Sesjon-datoer, spesielle ønsker, etc."
            className="w-full"
          />
        </div>

        {error && (
          <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
            {loading ? "Oppretter..." : "Opprett prosjekt"}
          </button>
          <Link
            href="/prosjekter"
            className="px-6 py-3 text-white/60 hover:text-white text-sm"
          >
            Avbryt
          </Link>
        </div>

        {releaseDate && (
          <div className="bg-gold/5 border border-gold/20 rounded-lg p-4 text-sm text-gold/80">
            ✨ Milepæler vil auto-genereres fra slippdatoen when project is created.
          </div>
        )}
      </form>
    </div>
  );
}
