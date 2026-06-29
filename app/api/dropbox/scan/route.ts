import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Scan Dropbox recursively in ONE call and auto-match folders to projects
export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get Dropbox token
  const { data: dropboxSettings } = await supabase
    .from("dropbox_settings")
    .select("access_token")
    .eq("user_id", user.id)
    .single();

  if (!dropboxSettings?.access_token) {
    return NextResponse.json({ error: "Dropbox ikke tilkoblet" }, { status: 400 });
  }

  // Mark scan as in-progress
  await supabase
    .from("dropbox_settings")
    .update({ scan_status: "scanning" })
    .eq("user_id", user.id);

  const body = await request.json().catch(() => ({}));
  const rootPath = body.path || "";

  // Single recursive API call — gets ALL folders in one request
  const dropboxRes = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${dropboxSettings.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: rootPath || "",
      recursive: true,
      include_media_info: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
    }),
  });

  if (!dropboxRes.ok) {
    const err = await dropboxRes.text();
    return NextResponse.json({ error: "Dropbox API feilet: " + err }, { status: 500 });
  }

  const dropboxData = await dropboxRes.json();

  // Collect folders — filter to only Grupper/2026/ and Grupper/2027/
  let allFolders: any[] = (dropboxData.entries || []).filter((e: any) => {
    if (e[".tag"] !== "folder") return false;
    const p = e.path_lower || "";
    return p.includes("/grupper/2026/") || p.includes("/grupper/2027/");
  });

  // Handle pagination if there are more results
  let hasMore = dropboxData.has_more;
  let cursor = dropboxData.cursor;

  while (hasMore && cursor) {
    const continueRes = await fetch("https://api.dropboxapi.com/2/files/list_folder/continue", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${dropboxSettings.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cursor }),
    });

    if (!continueRes.ok) break;

    const continueData = await continueRes.json();
    allFolders = [...allFolders, ...(continueData.entries || []).filter((e: any) => {
      if (e[".tag"] !== "folder") return false;
      const p = e.path_lower || "";
      return p.includes("/grupper/2026/") || p.includes("/grupper/2027/");
    })];
    hasMore = continueData.has_more;
    cursor = continueData.cursor;
  }

  // Get all projects
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, dropbox_link");

  if (!projects) {
    return NextResponse.json({ error: "Kunne ikke hente prosjekter" }, { status: 500 });
  }

  // Match folders to projects — deepest match wins
  const matches: { projectId: string; projectName: string; folderName: string; folderPath: string; folderPathDisplay: string }[] = [];
  const unmatched: { folderName: string; folderPath: string }[] = [];

  for (const folder of allFolders) {
    const folderName = folder.name.toLowerCase();
    const folderPath = folder.path_lower || "";
    const folderPathDisplay = folder.path_display || folderPath;
    let matched = false;

    for (const project of projects) {
      const projectName = project.name.toLowerCase();
      if (folderName.includes(projectName) || projectName.includes(folderName)) {
        const existing = matches.find(m => m.projectId === project.id);
        if (!existing || folderPath.length > existing.folderPath.length) {
          if (existing) {
            matches.splice(matches.indexOf(existing), 1);
          }
          matches.push({
            projectId: project.id,
            projectName: project.name,
            folderName: folder.name,
            folderPath,
            folderPathDisplay,
          });
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      const hasChildren = allFolders.some(f =>
        (f.path_lower || "") !== folderPath &&
        (f.path_lower || "").startsWith(folderPath + "/")
      );
      if (!hasChildren) {
        unmatched.push({ folderName: folder.name, folderPath });
      }
    }
  }

  // Link matched folders using Dropbox web URL — no share API needed
  let updatedCount = 0;
  let linkedCount = 0;
  const matchResults: any[] = [];

  for (const match of matches) {
    const dropboxUrl = `https://www.dropbox.com/home${match.folderPathDisplay}`;

    const { error } = await supabase
      .from("projects")
      .update({ dropbox_link: dropboxUrl })
      .eq("id", match.projectId);

    const isLinked = !error;
    if (isLinked) {
      updatedCount++;
      linkedCount++;
    }

    matchResults.push({
      projectId: match.projectId,
      project: match.projectName,
      folder: match.folderName,
      linked: isLinked,
    });
  }

  // Filter unmatched to only show likely project folders (contain year or "snekk")
  const likelyProjects = unmatched.filter(f =>
    /\b(20\d{2}|snekk|russ|hjemmesnekk|borghini)\b/i.test(f.folderName)
  );

  const result = {
    totalFolders: allFolders.length,
    matched: matches.length,
    unmatched: unmatched.length,
    updated: updatedCount,
    linked: linkedCount,
    unmatchedFolders: likelyProjects.slice(0, 15),
    matches: matchResults,
  };

  // Save scan result + mark complete
  await supabase
    .from("dropbox_settings")
    .update({
      scan_status: "complete",
      scan_completed_at: new Date().toISOString(),
      scan_result: result,
    })
    .eq("user_id", user.id);

  return NextResponse.json(result);
}
