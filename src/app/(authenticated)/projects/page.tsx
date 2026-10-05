import ProjectBrowser from "@/components/projects/ProjectBrowser";
import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  let completedIds = new Set<string>();

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
        .eq("user_id", user.id);

      if (!error && Array.isArray(data)) {
        completedIds = new Set(data.map((item) => String(item.project_id)));
      }
    }
  } catch {
    completedIds = new Set();
  }

  return <ProjectBrowser initialCompletedIds={completedIds} />;
}
