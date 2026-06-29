import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Redirect user to Dropbox OAuth consent screen
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("return") || "/prosjekter";

  const appKey = process.env.DROPBOX_APP_KEY!;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dropbox/callback`;

  // Store return URL in state
  const state = encodeURIComponent(returnUrl);

  const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${appKey}&response_type=code&redirect_uri=${redirectUri}&token_access_type=offline&state=${state}`;

  return NextResponse.redirect(authUrl);
}
