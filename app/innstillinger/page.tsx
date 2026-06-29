import { createClient } from "@/lib/supabase/server";
import { DropboxSettings } from "@/components/dropbox-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id || "")
    .maybeSingle();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Innstillinger</h1>
      </div>

      {/* Profile */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Profil</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-dark-muted text-xs mb-1">Navn</p>
            <p className="text-white">{profile?.name || user?.email}</p>
          </div>
          <div>
            <p className="text-dark-muted text-xs mb-1">E-post</p>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <p className="text-dark-muted text-xs mb-1">Rolle</p>
            <p className="text-gold">{profile?.role === "admin" ? "Admin" : "Produsent"}</p>
          </div>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Varslingspreferanser</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
            Vis varsler på dashboard ved kritiske deadlines
          </label>
          <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-gold" />
            Marker prosjekter med ≤14 dager til deadline som haster
          </label>
          <label className="flex items-center gap-3 text-sm text-white/80 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-gold" />
            Send e-post når TikTok-lyd mangler (kommer snart)
          </label>
        </div>
      </div>

      {/* Dropbox */}
      <DropboxSettings />

      {/* About */}
      <div className="bg-dark-surface border border-dark-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Om</h2>
        <div className="text-sm text-dark-muted space-y-2">
          <p>Borghini Creative OS — V1</p>
          <p>Prosjektstyring for Borghini Entertainment</p>
          <p className="text-gold/60 italic">"Mindre tid på admin, mer tid på musikk."</p>
        </div>
      </div>
    </div>
  );
}
