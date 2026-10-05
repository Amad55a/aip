import { NextResponse } from "next/server";
import { isValidLanguage } from "@/i18n";
import { getLocalizedProject, PROJECTS } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";

type SearchResult = {
  id: string;
  type: "lesson" | "module" | "course" | "project" | "learningPath";
  title: string;
  description: string;
  href: string;
  context: string;
};

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.trim() ?? "";
  const requestedLanguage = searchParams.get("language");
  const language = isValidLanguage(requestedLanguage) ? requestedLanguage : "en";
  if (query.length < 2 || query.length > 100) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Please sign in to search learning content." }, { status: 401 });
  }

  const { data: curriculumResults, error: searchError } = await supabase.rpc(
    "search_learning_content",
    { p_query: query, p_language: language }
  );
  if (searchError) {
    console.error("Global curriculum search failed.", {
      userId: user.id,
      code: searchError.code,
      message: searchError.message,
    });
    return NextResponse.json({ error: "Search is temporarily unavailable." }, { status: 500 });
  }

  const databaseResults: SearchResult[] = curriculumResults.map((item) => {
    const resultType = item.result_type === "learningPath"
      ? "learningPath"
      : item.result_type === "lesson" || item.result_type === "module" || item.result_type === "course"
        ? item.result_type
        : "lesson";
    return {
      id: item.id,
      type: resultType,
      title: item.title,
      description: item.description,
      href: item.href,
      context: item.context,
    };
  });

  const normalizedQuery = query.toLocaleLowerCase();
  const matchingProjects = PROJECTS
    .map((project) => ({ project, localized: getLocalizedProject(project, language) }))
    .filter(({ project, localized }) =>
      `${localized.title} ${localized.description} ${project.title} ${project.description} ${project.technologies.join(" ")}`
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    )
    .slice(0, 5);
  const projectResults: SearchResult[] = matchingProjects.map(({ project, localized }) => ({
    id: project.id,
    type: "project",
    title: localized.title,
    description: localized.description,
    href: `/projects/${project.slug}`,
    context: project.category === "mern" ? "MERN" : "HTML, CSS & JavaScript",
  }));

  return NextResponse.json({
    results: [...databaseResults, ...projectResults].slice(0, 25),
    usedEnglishFallback:
      language !== "en" &&
      (curriculumResults.some((item) => item.used_english_fallback) ||
        matchingProjects.some(({ project, localized }) => localized.title === project.title)),
  });
}
