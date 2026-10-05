import { NextResponse } from "next/server";
import { getProjectBySlug, PROJECTS_BY_ID } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The completion request must include valid JSON." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "A valid project request is required." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const slug = typeof payload.slug === "string" ? payload.slug : undefined;
  const projectId = typeof payload.projectId === "string" ? payload.projectId : undefined;

  if (!slug && !projectId) {
    return NextResponse.json({ error: "A project slug or ID is required." }, { status: 400 });
  }

  const project = slug ? getProjectBySlug(slug) : PROJECTS_BY_ID[projectId ?? ""];
  if (!project) {
    return NextResponse.json({ error: "This project could not be found." }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Please sign in to save your project progress." }, { status: 401 });
  }

  const { error } = await supabase.from("project_completions").upsert(
    { user_id: user.id, project_id: project.id, completed_at: new Date().toISOString() },
    { onConflict: "user_id,project_id", ignoreDuplicates: true }
  );

  if (error) {
    console.error("Unable to save project completion.", {
      code: error.code,
      message: error.message,
    });

    if (error.code === "42P01" || error.code === "PGRST205") {
      return NextResponse.json(
        { error: "Project completion storage is not set up yet. Apply the latest Supabase migrations and try again." },
        { status: 503 }
      );
    }

    if (error.code === "42P10") {
      return NextResponse.json(
        { error: "Project completion storage needs its latest database migration. Apply the latest Supabase migrations and try again." },
        { status: 503 }
      );
    }

    if (error.code === "42501") {
      return NextResponse.json(
        { error: "Supabase is blocking this completion save. Check the project_completions permissions and row-level security policy." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Could not mark this project as complete. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, projectId: project.id, completed: true });
}
