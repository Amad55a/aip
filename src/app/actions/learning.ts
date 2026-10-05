"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Lesson, LessonQuizQuestion } from "@/lib/supabase/database.types";
import { buildLessonMaterial, resolveLessonQuiz } from "@/lib/learning/lesson-content";
import { getServerLanguage } from "@/lib/i18n/server-language";
import { translations } from "@/i18n";

export type QuizAnswer = {
  questionId: string;
  answer: string;
};

export type QuizResult = {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

function refreshLearningViews() {
  revalidatePath("/dashboard");
  revalidatePath("/learn");
}

async function learningRequestError(
  operation: string,
  error: { message?: string; code?: string; details?: string | null; hint?: string | null },
  context: Record<string, string>
) {
  console.error(`[learning] ${operation} failed`, {
    ...context,
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
  const language = await getServerLanguage();
  return translations[language].appShell.errors.requestFailed;
}

async function pathProgressError(
  operation: string,
  error: {
    message?: string;
    code?: string;
    details?: string | null;
    hint?: string | null;
  },
  context: { userId: string; lessonId: string }
) {
  console.error(`[completeLesson] ${operation} failed`, {
    ...context,
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
  const language = await getServerLanguage();
  return translations[language].appShell.lessonContent.progressUpdateError;
}

async function getLessonQuestions(
  supabase: Awaited<ReturnType<typeof createClient>>,
  lesson: {
    id: string;
    module_id: string;
    title: string;
    description: string | null;
    quiz_questions: LessonQuizQuestion[];
    translations: Lesson["translations"];
  }
) {
  const language = await getServerLanguage();
  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("course_id,title,level,translations")
    .eq("id", lesson.module_id)
    .maybeSingle();
  if (moduleError) {
    return { error: await learningRequestError("loading quiz module", moduleError, { lessonId: lesson.id }) };
  }
  if (!module) return { error: "This lesson's module is not available." };
  const localizedModule = {
    ...module,
    title: module.translations[language]?.title ?? module.title,
  };

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("slug,title,translations")
    .eq("id", module.course_id)
    .maybeSingle();
  if (courseError) {
    return { error: await learningRequestError("loading quiz course", courseError, { lessonId: lesson.id }) };
  }
  if (!course) return { error: "This lesson's course is not available." };
  const localizedCourse = {
    ...course,
    title: course.translations[language]?.title ?? course.title,
  };
  const localizedLesson = {
    ...lesson,
    title: lesson.translations[language]?.title ?? lesson.title,
    description: lesson.translations[language]?.description ?? lesson.description,
    quiz_questions:
      lesson.translations[language]?.quiz_questions ?? lesson.quiz_questions,
  };

  const material = buildLessonMaterial({
    courseSlug: localizedCourse.slug,
    courseTitle: localizedCourse.title,
    moduleTitle: localizedModule.title,
    lessonTitle: localizedLesson.title,
    description: localizedLesson.description,
    level: localizedModule.level,
  });
  const localizedMaterial = {
    ...material,
    ...lesson.translations[language]?.study_material,
  };
  return {
    questions: resolveLessonQuiz(
      localizedLesson.quiz_questions,
      localizedMaterial
    ),
  };
}

export async function startLearningPath(learningPathId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Please sign in again before starting this learning path." };
  }

  const { data: path, error: pathError } = await supabase
    .from("learning_paths")
    .select("id")
    .eq("id", learningPathId)
    .eq("is_published", true)
    .maybeSingle();

  if (pathError) {
    return { error: await learningRequestError("loading learning path", pathError, { userId: user.id, learningPathId }) };
  }
  if (!path) return { error: "This learning path is not available." };

  const { data: existing, error: existingError } = await supabase
    .from("enrollments")
    .select("id,status")
    .eq("user_id", user.id)
    .eq("learning_path_id", path.id)
    .maybeSingle();

  if (existingError) {
    return {
      error: await learningRequestError("checking enrollment", existingError, {
        userId: user.id,
        learningPathId: path.id,
      }),
    };
  }

  if (existing) {
    if (existing.status === "paused") {
      const { error } = await supabase
        .from("enrollments")
        .update({ status: "active" })
        .eq("id", existing.id)
        .eq("user_id", user.id);
      if (error) {
        return {
          error: await learningRequestError("resuming enrollment", error, {
            userId: user.id,
            learningPathId: path.id,
          }),
        };
      }
    }
  } else {
    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      learning_path_id: path.id,
      status: "active",
    });
    if (error) {
      if (error.code !== "23505") {
        return {
          error: await learningRequestError("creating enrollment", error, {
            userId: user.id,
            learningPathId: path.id,
          }),
        };
      }
      // A parallel Start Learning request created the unique enrollment first.
    }
  }

  refreshLearningViews();
  return { success: true };
}

export async function submitLessonQuiz(lessonId: string, answers: QuizAnswer[]) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Please sign in again before submitting this quiz." };
  }
  if (
    !Array.isArray(answers) ||
    answers.length > 20 ||
    answers.some(
      (answer) =>
        !answer ||
        typeof answer.questionId !== "string" ||
        typeof answer.answer !== "string" ||
        answer.answer.length > 1000
    )
  ) {
    return { error: "The submitted quiz answers are invalid." };
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id,module_id,title,description,quiz_questions,translations")
    .eq("id", lessonId)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError) {
    return { error: await learningRequestError("loading quiz", lessonError, { userId: user.id, lessonId }) };
  }
  if (!lesson) return { error: "This lesson is not available." };

  const questionResult = await getLessonQuestions(supabase, lesson);
  if ("error" in questionResult) return { error: questionResult.error };
  const questions = questionResult.questions;
  if (!questions.length) return { error: "This lesson does not have a quiz." };
  if (
    answers.length !== questions.length ||
    questions.some((question) => !answers.some(
      (answer) => answer.questionId === question.id && answer.answer.trim().length > 0
    ))
  ) {
    return { error: "Answer every question before checking your quiz." };
  }

  const normalized = (value: string) => value.trim().toLocaleLowerCase();
  const results: QuizResult[] = questions.map((question) => {
    const submitted = answers.find((answer) => answer.questionId === question.id)?.answer ?? "";
    const acceptable = [question.correctAnswer, ...(question.acceptableAnswers ?? [])];
    return {
      questionId: question.id,
      correct: acceptable.some((answer) => normalized(answer) === normalized(submitted)),
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  });
  const score = Math.round((results.filter((result) => result.correct).length / results.length) * 100);
  const now = new Date().toISOString();

  const { error: insertError } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lesson.id,
      status: "in_progress",
      started_at: now,
      last_accessed_at: now,
      quiz_score: score,
    },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: true }
  );
  if (insertError) {
    return { error: await learningRequestError("saving quiz progress", insertError, { userId: user.id, lessonId }) };
  }

  const { error: updateError } = await supabase
    .from("lesson_progress")
    .update({ quiz_score: score, last_accessed_at: now })
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id);
  if (updateError) {
    return { error: await learningRequestError("saving quiz score", updateError, { userId: user.id, lessonId }) };
  }

  refreshLearningViews();
  return { score, results };
}

export async function completeLesson(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Please sign in again before completing this lesson." };
  }

  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id,quiz_questions,module_id,title,description,translations")
    .eq("id", lessonId)
    .eq("is_published", true)
    .maybeSingle();

  if (lessonError) {
    return { error: await learningRequestError("loading lesson for completion", lessonError, { userId: user.id, lessonId }) };
  }
  if (!lesson) return { error: "This lesson is not available." };
  const questionResult = await getLessonQuestions(supabase, lesson);
  if ("error" in questionResult) return { error: questionResult.error };

  const { data: progress, error: progressError } = await supabase
    .from("lesson_progress")
    .select("id,quiz_score")
    .eq("user_id", user.id)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  if (progressError) {
    return {
      error: await learningRequestError("loading lesson progress", progressError, {
        userId: user.id,
        lessonId,
      }),
    };
  }
  if (questionResult.questions.length > 0 && (!progress || progress.quiz_score === null)) {
    return { error: "Complete the lesson quiz before marking this lesson complete." };
  }

  const now = new Date().toISOString();
  if (progress) {
    const { error } = await supabase
      .from("lesson_progress")
      .update({ status: "completed", completed_at: now, last_accessed_at: now })
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id);
    if (error) {
      return {
        error: await pathProgressError("saving lesson completion", error, { userId: user.id, lessonId }),
      };
    }
  } else {
    const { error } = await supabase.from("lesson_progress").insert({
      user_id: user.id,
      lesson_id: lesson.id,
      status: "completed",
      started_at: now,
      completed_at: now,
      last_accessed_at: now,
    });
    if (error) {
      return {
        error: await pathProgressError("saving lesson completion", error, { userId: user.id, lessonId }),
      };
    }
  }

  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("course_id")
    .eq("id", lesson.module_id)
    .maybeSingle();
  if (moduleError) {
    return {
      error: await pathProgressError("loading lesson module", moduleError, { userId: user.id, lessonId }),
      lessonCompleted: true,
    };
  }
  if (!module) return { error: "Lesson saved, but its module could not be found.", lessonCompleted: true };

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("learning_path_id")
    .eq("id", module.course_id)
    .maybeSingle();
  if (courseError) {
    return {
      error: await pathProgressError("loading learning path", courseError, { userId: user.id, lessonId }),
      lessonCompleted: true,
    };
  }
  if (!course) {
    return { error: "Lesson saved, but its learning path could not be found.", lessonCompleted: true };
  }

  const { data: pathProgress, error: pathProgressErrorResult } = await supabase.rpc(
    "get_learning_path_progress",
    { p_learning_path_id: course.learning_path_id }
  );
  if (pathProgressErrorResult) {
    return {
      error: await pathProgressError("calculating learning path progress", pathProgressErrorResult, {
        userId: user.id,
        lessonId,
      }),
      lessonCompleted: true,
    };
  }

  const totals = pathProgress[0];
  if (totals && totals.total_lessons > 0 && totals.completed_lessons === totals.total_lessons) {
    const { error } = await supabase
      .from("enrollments")
      .update({ status: "completed", completed_at: now })
      .eq("user_id", user.id)
      .eq("learning_path_id", course.learning_path_id);
    if (error) {
      return {
        error: await pathProgressError("updating learning path completion", error, {
          userId: user.id,
          lessonId,
        }),
        lessonCompleted: true,
      };
    }
  }

  refreshLearningViews();
  revalidatePath("/learn", "layout");
  return { success: true };
}
