import LearningPathCatalog from "@/components/learn/LearningPathCatalog";
import { createClient } from "@/lib/supabase/server";
import { getServerLanguage } from "@/lib/i18n/server-language";
import type { LearningPath } from "@/lib/supabase/database.types";

export default async function LearnPage() {
  const language = await getServerLanguage();
  const supabase = await createClient();
  const { data: paths, error: pathsError } = await supabase
    .from("learning_paths")
    .select("id,title,slug,description,short_description,difficulty,estimated_hours,translations")
    .eq("is_published", true)
    .order("created_at");

  if (pathsError) {
    console.error("Unable to load published learning paths.", {
      code: pathsError.code,
      message: pathsError.message,
    });
    throw new Error("Learning paths are temporarily unavailable.");
  }

  const pathIds = paths.map((path) => path.id);
  const { data: courses, error: coursesError } = pathIds.length
    ? await supabase
        .from("courses")
        .select("learning_path_id")
        .in("learning_path_id", pathIds)
        .eq("is_published", true)
    : { data: [], error: null };

  if (coursesError) {
    console.error("Unable to load learning path course counts.", {
      code: coursesError.code,
      message: coursesError.message,
    });
    throw new Error("Learning paths are temporarily unavailable.");
  }

  const courseCounts = new Map<string, number>();
  for (const course of courses) {
    courseCounts.set(course.learning_path_id, (courseCounts.get(course.learning_path_id) ?? 0) + 1);
  }

  const localizedPaths = paths.map((path: Pick<
    LearningPath,
    "id" | "title" | "slug" | "description" | "short_description" | "difficulty" | "estimated_hours" | "translations"
  >) => ({
    ...path,
    title: path.translations[language]?.title ?? path.title,
    description: path.translations[language]?.description ?? path.description,
    short_description: path.translations[language]?.short_description ?? path.short_description,
    courseCount: courseCounts.get(path.id) ?? 0,
  }));

  return <LearningPathCatalog paths={localizedPaths} />;
}
