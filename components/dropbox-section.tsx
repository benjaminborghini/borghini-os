"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ExternalLink, Link2, FolderOpen, CheckCircle2, AlertCircle, Pencil, Save, X } from "lucide-react";

export function DropboxSection({ projectId, dropboxLink, projectName }: { projectId: string; dropboxLink: string | null; projectName: string }) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(dropboxLink || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    const res = await fetch("/api/dropbox/status");
    const data = await res.json();
    setConnected(data.connected);
  }

  async function saveLink() {
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("projects")
      .update({ dropbox_link: url || null })
      .eq("id", projectId);

    setSaving(false);
    if (error) {
      setError("Kunne ikke lagre lenke");
    } else {
      setSaved(true);
      setEditing(false);
      setTimeout(() => window.location.reload(), 600);
    }
  }

  // Dropbox folder linked — show open button + edit
  if (dropboxLink || editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-gold" />
            <span className="text-sm text-white/80">Dropbox-filer</span>
          </div>
          {!editing && (
            <button
              onClick={() => { setEditing(true); setUrl(dropboxLink || ""); }}
              className="text-xs text-dark-muted hover:text-gold flex items-center gap-1 transition-colors"
            >
              <Pencil size={12} /> Endre
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.dropbox.com/home/..."
              className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-muted focus:border-gold/50 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={saveLink}
                disabled={saving}
                className="inline-flex items-center gap-2 bg-gold text-black font-medium px-3 py-1.5 rounded-lg text-sm hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? "Lagrer..." : "Lagre"}
              </button>
              <button
                onClick={() => { setEditing(false); setError(null); }}
                className="inline-flex items-center gap-2 bg-dark-hover border border-dark-border text-white px-3 py-1.5 rounded-lg text-sm hover:border-dark-muted transition-colors"
              >
                <X size={14} />
                Avbryt
              </button>
            </div>
            {error && <p className="text-xs text-danger flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
            {saved && <p className="text-xs text-success flex items-center gap-1"><CheckCircle2 size={12} /> Lagret! Oppdaterer...</p>}
          </div>
        ) : (
          <a
            href={dropboxLink!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-dark-hover border border-gold/30 text-gold px-4 py-2.5 rounded-lg text-sm hover:bg-gold/10 transition-colors w-full justify-center"
          >
            <ExternalLink size={16} />
            Åpne i Dropbox
          </a>
        )}
      </div>
    );
  }

  // No Dropbox link — show connect option
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen size={16} className="text-dark-muted" />
        <span className="text-sm text-white/80">Dropbox-filer</span>
      </div>

      {connected === null ? (
        <p className="text-dark-muted text-sm">Sjekker Dropbox-status...</p>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 space-y-3">
          <p className="text-sm text-white/60">
            Ingen Dropbox-mappe koblet. Koble til i innstillinger eller lim inn lenke manuelt.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 text-gold text-sm hover:underline"
          >
            <Pencil size={14} /> Legg til lenke manuelt
          </button>
          <div>
            <a
              href="/innstillinger"
              className="inline-flex items-center gap-2 text-dark-muted text-sm hover:text-gold"
            >
              <Link2 size={14} /> Gå til innstillinger for auto-scan
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
