"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { RefreshCw, Link2, CheckCircle2, AlertCircle, FolderOpen, Clock, Pencil, Save, X, ExternalLink } from "lucide-react";

export function DropboxSettings() {
  const supabase = createClient();
  const [connected, setConnected] = useState<boolean | null>(null);
  const [scanStatus, setScanStatus] = useState<string>("idle");
  const [scanCompletedAt, setScanCompletedAt] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    checkStatus();
    loadProjects();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("id, name, project_id, dropbox_link")
      .order("name");
    if (data) setProjects(data);
  }

  async function checkStatus() {
    const res = await fetch("/api/dropbox/status");
    const data = await res.json();
    setConnected(data.connected);
    setScanStatus(data.scanStatus);
    setScanCompletedAt(data.scanCompletedAt);
    setScanResult(data.scanResult);
    if (data.scanStatus === "scanning") {
      setScanning(true);
      startPolling();
    }
  }

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const res = await fetch("/api/dropbox/status");
      const data = await res.json();
      setScanStatus(data.scanStatus);
      setScanCompletedAt(data.scanCompletedAt);
      setScanResult(data.scanResult);
      if (data.scanStatus !== "scanning") {
        setScanning(false);
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        loadProjects(); // Refresh project links after scan
      }
    }, 3000);
  }

  async function scanDropbox() {
    setScanning(true);
    setScanStatus("scanning");
    try {
      await fetch("/api/dropbox/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "" }),
        keepalive: true,
      });
      await checkStatus();
      await loadProjects();
    } catch (e) {
      startPolling();
    }
    setScanning(false);
  }

  async function saveProjectLink(projectId: string) {
    setSavingId(projectId);
    const { error } = await supabase
      .from("projects")
      .update({ dropbox_link: editUrl || null })
      .eq("id", projectId);
    setSavingId(null);
    if (!error) {
      setEditingId(null);
      await loadProjects();
    }
  }

  function startEdit(project: any) {
    setEditingId(project.id);
    setEditUrl(project.dropbox_link || "");
  }

  // Only show projects that have a Dropbox link or were in the scan matches
  const linkedScanIds = new Set((scanResult?.matches || []).map((m: any) => m.projectId));
  const relevantProjects = projects.filter(p => p.dropbox_link || linkedScanIds.has(p.id));

  function formatTime(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("nb-NO", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <FolderOpen size={20} className="text-gold" />
        <h2 className="text-lg font-semibold text-white">Dropbox-integrasjon</h2>
      </div>

      {connected === null ? (
        <p className="text-dark-muted text-sm">Sjekker status...</p>
      ) : !connected ? (
        <div className="space-y-3">
          <p className="text-sm text-white/60">
            Koble til Dropbox for å automatisk koble mapper til prosjekter. Én scan kobler alle prosjekter.
          </p>
          <a
            href="/api/dropbox/auth"
            className="inline-flex items-center gap-2 bg-gold text-black font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-gold-light transition-colors"
          >
            <Link2 size={16} />
            Koble til Dropbox
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle2 size={16} />
            Dropbox tilkoblet
          </div>

          <div className="border-t border-dark-border pt-4">
            <p className="text-sm text-white/60 mb-3">
              Skann alle Dropbox-mapper og koble dem automatisk til prosjektene. Du kan forlate siden mens scanningen pågår.
            </p>
            <button
              onClick={scanDropbox}
              disabled={scanning}
              className="inline-flex items-center gap-2 bg-dark-hover border border-dark-border text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:border-gold/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={scanning ? "animate-spin" : ""} />
              {scanning ? "Skanner i bakgrunnen..." : "Skann & koble mapper"}
            </button>
          </div>

          {scanStatus === "scanning" && (
            <div className="border-t border-dark-border pt-4">
              <div className="flex items-center gap-2 text-sm text-gold">
                <Clock size={16} className="animate-pulse" />
                Scan pågår — du kan navigere til andre sider mens den kjører.
              </div>
            </div>
          )}

          {/* Scan summary */}
          {scanResult && scanStatus === "complete" && (
            <div className="border-t border-dark-border pt-4 space-y-3">
              {scanCompletedAt && (
                <p className="text-xs text-dark-muted">Sist skannet: {formatTime(scanCompletedAt)}</p>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-dark-card rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-white">{scanResult.totalFolders}</p>
                  <p className="text-xs text-dark-muted">Mapper funnet</p>
                </div>
                <div className="bg-dark-card rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gold">{scanResult.matched}</p>
                  <p className="text-xs text-dark-muted">Matchet</p>
                </div>
                <div className="bg-dark-card rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-success">{scanResult.linked || scanResult.updated}</p>
                  <p className="text-xs text-dark-muted">Lenker opprettet</p>
                </div>
              </div>
            </div>
          )}

          {/* Editable project links */}
          {relevantProjects.length > 0 && (
            <div className="border-t border-dark-border pt-4">
              <p className="text-sm font-medium text-white mb-2">Prosjekt-lenker:</p>
              <div className="space-y-1">
                {relevantProjects.map((p) => (
                  <div key={p.id} className="bg-dark-card rounded-lg px-3 py-2 text-sm">
                    {editingId === p.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white/80 font-medium">{p.name}</span>
                          {p.project_id && <span className="text-xs text-dark-muted font-mono">{p.project_id}</span>}
                        </div>
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="https://www.dropbox.com/home/..."
                          className="w-full bg-dark-hover border border-dark-border rounded px-2 py-1.5 text-xs text-white placeholder:text-dark-muted focus:border-gold/50 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveProjectLink(p.id)}
                            disabled={savingId === p.id}
                            className="inline-flex items-center gap-1 bg-gold text-black font-medium px-2 py-1 rounded text-xs hover:bg-gold-light"
                          >
                            <Save size={12} /> {savingId === p.id ? "..." : "Lagre"}
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="inline-flex items-center gap-1 bg-dark-hover border border-dark-border text-white px-2 py-1 rounded text-xs"
                          >
                            <X size={12} /> Avbryt
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-white/80 truncate">{p.name}</span>
                          {p.project_id && <span className="text-xs text-dark-muted font-mono flex-shrink-0">{p.project_id}</span>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {p.dropbox_link ? (
                            <>
                              <a
                                href={p.dropbox_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold hover:underline text-xs flex items-center gap-1"
                              >
                                <ExternalLink size={12} /> Åpne
                              </a>
                              <CheckCircle2 size={14} className="text-success" />
                            </>
                          ) : (
                            <span className="text-xs text-dark-muted">Ingen lenke</span>
                          )}
                          <button
                            onClick={() => startEdit(p)}
                            className="text-dark-muted hover:text-gold transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unmatched folders */}
          {scanResult?.unmatched > 0 && scanResult.unmatchedFolders?.length > 0 && (
            <div className="border-t border-dark-border pt-4">
              <p className="text-sm font-medium text-white/60 mb-2">
                Ikke matchet ({scanResult.unmatchedFolders.length} vist av {scanResult.unmatched}):
              </p>
              <div className="flex flex-wrap gap-1">
                {scanResult.unmatchedFolders.map((f: any, i: number) => (
                  <span key={i} className="text-xs bg-dark-hover px-2 py-1 rounded text-white/40">
                    {f.folderName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
