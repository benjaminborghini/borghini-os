"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDate, timeAgo, cn } from "@/lib/utils";
import { Plus, Clock, AlertCircle, FileText } from "lucide-react";
import { AudioFileEmblem, VideoFileEmblem, DocFileEmblem } from "@/components/emblems";
import type { Feedback } from "@/lib/types";

export function FeedbackLog({ projectId }: { projectId: string }) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [sender, setSender] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchFeedback();
  }, []);

  async function fetchFeedback() {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setFeedback(data || []);
    setLoading(false);
  }

  async function addFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const filePath = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from("feedback-files")
        .upload(filePath, file);

      if (!error) {
        fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/feedback-files/${filePath}`;
        fileName = file.name;
      }
    }

    const { data } = await supabase
      .from("feedback")
      .insert({
        project_id: projectId,
        content: content.trim(),
        sender: sender.trim() || "Ukjent",
        file_url: fileUrl,
        file_name: fileName,
      })
      .select()
      .single();

    if (data) {
      setFeedback([data, ...feedback]);
      setContent("");
      setSender("");
      setFile(null);
      setShowForm(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("feedback").update({ status }).eq("id", id);
    setFeedback(feedback.map((f) => (f.id === id ? { ...f, status: status as any } : f)));
  }

  if (loading) return <div className="text-dark-muted text-sm">Laster...</div>;

  const statusColors: Record<string, string> = {
    ny: "text-danger bg-danger/10",
    sett: "text-warning bg-warning/10",
    håndtert: "text-success bg-success/10",
  };

  const statusLabels: Record<string, string> = {
    ny: "Ny",
    sett: "Sett",
    håndtert: "Håndtert",
  };

  return (
    <div>
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-gold text-sm hover:underline mb-4"
        >
          <Plus size={16} />
          Legg inn feedback
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={addFeedback} className="mb-6 bg-dark-card border border-dark-border rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-xs text-dark-muted mb-1">Fra (hvem)</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="F.eks. Bussjef, Musikkansvarlig..."
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1">Tilbakemelding</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              placeholder="Hva sa gruppa?"
              className="w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-dark-muted mb-1">Fil (lyd/video/bilde) — valgfritt</label>
            <input
              type="file"
              accept="audio/*,video/*,image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-gold text-black font-medium px-4 py-2 rounded-lg text-sm hover:bg-gold-light"
            >
              Lagre
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-white/60 hover:text-white px-4 py-2 text-sm"
            >
              Avbryt
            </button>
          </div>
        </form>
      )}

      {/* Feedback list */}
      <div className="space-y-3">
        {feedback.map((item) => (
          <div
            key={item.id}
            className="bg-dark-card border border-dark-border rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{item.sender}</span>
                <span className="text-xs text-dark-muted">{timeAgo(item.created_at)}</span>
              </div>
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value)}
                className={cn(
                  "text-xs rounded-md px-2 py-1 border-none cursor-pointer",
                  statusColors[item.status]
                )}
              >
                <option value="ny">Ny</option>
                <option value="sett">Sett</option>
                <option value="håndtert">Håndtert</option>
              </select>
            </div>
            <p className="text-sm text-white/80 whitespace-pre-wrap">{item.content}</p>
            {item.file_url && (
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-xs text-gold hover:underline"
              >
                {item.file_name?.match(/\.(mp3|wav|ogg|m4a)$/i) ? (
                  <><AudioFileEmblem size={14} /> {item.file_name}</>
                ) : item.file_name?.match(/\.(mp4|mov|avi|webm)$/i) ? (
                  <><VideoFileEmblem size={14} /> {item.file_name}</>
                ) : (
                  <><DocFileEmblem size={14} /> {item.file_name}</>
                )}
              </a>
            )}
          </div>
        ))}
      </div>

      {feedback.length === 0 && (
        <p className="text-dark-muted text-sm text-center py-6">
          Ingen feedback ennå. All feedback samles her.
        </p>
      )}
    </div>
  );
}
