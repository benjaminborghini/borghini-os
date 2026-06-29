import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// OAuth callback — exchanges code for access token, stores in Supabase
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state") || "/prosjekter";

  if (error || !code) {
    return NextResponse.redirect(new URL(`/innstillinger?dropbox_error=${error || "no_code"}`, request.url));
  }

  const appKey = process.env.DROPBOX_APP_KEY!;
  const appSecret = process.env.DROPBOX_APP_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dropbox/callback`;

  // Exchange code for token
  const tokenRes = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${appKey}:${appSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    console.error("Dropbox token exchange failed:", err);
    return NextResponse.redirect(new URL("/innstillinger?dropbox_error=token_failed", request.url));
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;

  // Store tokens in Supabase (in a settings table or user profile)
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Store in a dropbox_settings table (we'll create this)
  await supabase
    .from("dropbox_settings")
    .upsert({
      user_id: user.id,
      access_token: accessToken,
      refresh_token: refreshToken,
      connected_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  return NextResponse.redirect(new URL(decodeURIComponent(state), request.url));
}
