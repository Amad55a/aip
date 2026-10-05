import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { AIContextType, AIProviderAttempt } from "@/lib/ai/types";
import type { Language } from "@/i18n";

export const getAIDailyLimit = () => 5;

export type AIDailyUsage = {
  date: string;
  limit: number;
  used: number;
  remaining: number;
};

type UsageRecord = {
  usage_date: string;
  question_count: number;
  daily_limit: number;
  remaining_count: number;
};

export class AIUsageUnavailableError extends Error {
  constructor() {
    super("AI daily usage could not be verified.");
    this.name = "AIUsageUnavailableError";
  }
}

function logUsageDatabaseError(operation: string, error: {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
  status?: number;
} | null) {
  console.error("[AI QUOTA] Database operation failed", JSON.stringify({
    operation,
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
  }));
}

function logUsageOperationStarted(operation: string) {
  console.info("[AI QUOTA] Database operation started", JSON.stringify({ operation }));
}

function usageFromRecord(record: UsageRecord): AIDailyUsage {
  return {
    date: record.usage_date,
    limit: record.daily_limit,
    used: record.question_count,
    remaining: record.remaining_count,
  };
}

export async function getAIDailyUsage(
  supabase: SupabaseClient<Database>
): Promise<AIDailyUsage> {
  const dailyLimit = getAIDailyLimit();
  logUsageOperationStarted("get_ai_usage");
  const { data, error } = await supabase.rpc("get_ai_usage", {
    p_daily_limit: dailyLimit,
  });

  if (error || !data?.[0]) {
    if (error) {
      logUsageDatabaseError("get_ai_usage", error);
    } else {
      console.error("[AI QUOTA] Database operation returned no record", JSON.stringify({
        operation: "get_ai_usage",
      }));
    }
    throw new AIUsageUnavailableError();
  }

  return usageFromRecord(data[0]);
}

export async function reserveAIDailyQuestion(
  supabase: SupabaseClient<Database>,
  requestId: string,
  contextType: AIContextType,
  language: Language
): Promise<{ allowed: boolean; usage: AIDailyUsage; requestId: string | null }> {
  const dailyLimit = getAIDailyLimit();
  logUsageOperationStarted("reserve_ai_question");
  const { data, error } = await supabase.rpc("reserve_ai_question", {
    p_daily_limit: dailyLimit,
    p_request_id: requestId,
    p_context_type: contextType,
    p_language: language,
  });

  if (error || !data?.[0]) {
    if (error) {
      logUsageDatabaseError("reserve_ai_question", error);
    } else {
      console.error("[AI QUOTA] Database operation returned no record", JSON.stringify({
        operation: "reserve_ai_question",
      }));
    }
    throw new AIUsageUnavailableError();
  }

  return {
    allowed: data[0].allowed,
    usage: usageFromRecord(data[0]),
    requestId: data[0].request_id,
  };
}

export async function finalizeAIRequest(
  supabase: SupabaseClient<Database>,
  requestId: string,
  result: {
    status: "succeeded" | "failed";
    provider: AIProviderAttempt["provider"] | null;
    model: string | null;
    errorCode: string | null;
    responseTimeMs: number;
    attempts: AIProviderAttempt[];
  }
) {
  const { error } = await supabase.rpc("finalize_ai_request", {
    p_request_id: requestId,
    p_status: result.status,
    p_provider: result.provider,
    p_model: result.model,
    p_error_code: result.errorCode,
    p_response_time_ms: result.responseTimeMs,
    p_attempts: result.attempts.map((attempt) => ({
      provider: attempt.provider,
      model: attempt.model,
      status: attempt.status,
      error_code: attempt.errorCode,
      response_time_ms: attempt.responseTimeMs,
    })),
  });
  if (error) {
    console.error("[AI] request finalization database error", {
      requestId,
      operation: "finalize_request",
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    return false;
  }
  return true;
}
