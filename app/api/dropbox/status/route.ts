import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Check if Dropbox is connected
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("dropbox_settings")
    .select("connected_at, scan_status, scan_completed_at, scan_result")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    connected: !!data,
    scanStatus: data?.scan_status || "idle",
    scanCompletedAt: data?.scan_completed_at || null,
    scanResult: data?.scan_result || null,
  });
}
