import { createClient } from "@/lib/supabase/server";
import { Phone } from "lucide-react";
import type { Producer } from "@/lib/types";

export const dynamic = "force-dynamic";

const roleLabels: Record<string, string> = {
  snekker: "Snekker",
  sluttforing: "Sluttfølging",
  tracks: "Tracks",
  latskriver: "Låtskriver",
  kreativ: "Kreativ partner",
};

const roleColors: Record<string, string> = {
  snekker: "text-gold bg-gold/10",
  sluttforing: "text-blue-400 bg-blue-950",
  tracks: "text-purple-400 bg-purple-950",
  latskriver: "text-emerald-400 bg-emerald-950",
  kreativ: "text-pink-400 bg-pink-950",
};

export default async function TeamPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("producers")
    .select("*")
    .eq("active", true)
    .order("name");

  const producers: Producer[] = data || [];

  // Group by role
  const roles = ["snekker", "sluttforing", "tracks", "latskriver", "kreativ"];
  const grouped: Record<string, Producer[]> = {};
  for (const r of roles) {
    grouped[r] = producers.filter((p) => p.role === r);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Team</h1>
        <p className="text-dark-muted text-sm mt-1">{producers.length} aktive medlemmer</p>
      </div>

      {roles.map((role) => {
        const members = grouped[role];
        if (!members || members.length === 0) return null;

        return (
          <div key={role}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded ${roleColors[role]}`}>
                {roleLabels[role]}
              </span>
              <span className="text-dark-muted text-sm">({members.length})</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-dark-card border border-dark-border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white">{member.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${roleColors[member.role]}`}>
                      {roleLabels[member.role]}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {member.daw && (
                      <p className="text-dark-muted">DAW: <span className="text-white/80">{member.daw}</span></p>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="text-gold flex items-center gap-1 text-sm">
                        <Phone size={12} /> {member.phone}
                      </a>
                    )}
                    {member.notes && (
                      <p className="text-white/60 text-xs mt-2">{member.notes}</p>
                    )}
                    {member.spotify_url && (
                      <a
                        href={member.spotify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold text-xs hover:underline mt-2 inline-block"
                      >
                        Spotify →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
