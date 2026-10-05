import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectBySlug } from "@/lib/projects";
import ProjectDetailClient from "@/components/projects/ProjectDetailClient";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  let completed = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!authError && user) {
      const { data, error } = await supabase
        .from("project_completions")
        .select("project_id")
        .eq("user_id", user.id)
        .eq("project_id", project.id)
        .maybeSingle();

      if (!error && data && typeof data.project_id === "string") {
        completed = true;
      }
    }
  } catch {
    completed = false;
  }

  return <ProjectDetailClient project={project} initialCompleted={completed} />;
}
