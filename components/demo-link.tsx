"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import { Lock, ExternalLink, Plus, Music } from "lucide-react";
import { AudioFileEmblem } from "@/components/emblems";
import type { Song } from "@/lib/types";
import { DEMO_LINK_DURATION_DAYS } from "@/lib/constants";

export function DemoLink({ projectId }: { projectId: string }) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchSongs();
  }, []);

  async function fetchSongs() {
    const { data } = await supabase
      .from("songs")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setSongs(data || []);
  }

  async function addSong(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const expiresAt = demoLink
      ? new Date(Date.now() + DEMO_LINK_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data } = await supabase
      .from("songs")
      .insert({
        project_id: projectId,
        title: title.trim(),
        demo_link: demoLink.trim() || null,
        demo_expires_at: expiresAt,
        status: "Demo",
      })
      .select()
      .single();

    if (data) {
      setSongs([data, ...songs]);
      setTitle("");
      setDemoLink("");
      setShowForm(false);
    }
  }

  return (
    <div>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-gold text-sm hover:underline mb-4"
        >
          <Plus size={16} />
          Legg til låt / demo
        </button>
      )}

      {showForm && (
        <form onSubmit={addSong} className="mb-6 bg-dark-card border border-dark-border rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs text-dark-muted mb-1">Låttittel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="F.eks. Gods Plan 2027"
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1">Demo-link (SoundCloud e.l.)</label>
            <input
              type="url"
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              placeholder="https://soundcloud.com/..."
              className="w-full text-sm"
            />
            <p className="text-xs text-dark-muted mt-1">
              🔒 Linken utløper automatisk etter {DEMO_LINK_DURATION_DAYS} dager
            </p>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-gold text-black font-medium px-4 py-2 rounded-lg text-sm hover:bg-gold-light">
              Lagre
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/60 hover:text-white px-4 py-2 text-sm">
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Songs list */}
      <div className="space-y-3">
        {songs.map((song) => {
          const days = daysUntil(song.demo_expires_at);
          const expired = days !== null && days < 0;

          return (
            <div key={song.id} className="bg-dark-card border border-dark-border rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Music size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{song.title}</p>
                    <p className="text-xs text-dark-muted">{song.status}</p>
                  </div>
                </div>
              </div>

              {song.demo_link && (
                <div className="mt-3">
                  {expired ? (
                    <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">
                      <Lock size={14} />
                      Demo utløpt — ny versjon klar
                    </div>
                  ) : (
                    <a
                      href={song.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-gold text-sm bg-gold/10 rounded-lg px-3 py-2 hover:bg-gold/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink size={14} />
                        Åpne demo
                      </span>
                      {days !== null && (
                        <span className="text-xs text-gold/60">
                          {days}d igjen
                        </span>
                      )}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {songs.length === 0 && (
        <p className="text-dark-muted text-sm text-center py-6">
          Ingen låter registrert ennå.
        </p>
      )}
    </div>
  );
}
