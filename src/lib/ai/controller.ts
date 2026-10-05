import type { SupabaseClient } from "@supabase/supabase-js";
import type { Language } from "@/i18n";
import type { Database } from "@/lib/supabase/database.types";
import { AIGenerationError, type AIContextType, type AIProvider, type AIRequest } from "@/lib/ai/types";
import { getConfiguredAIProviders } from "@/lib/ai/providers/index";
import { generateAIResponse } from "@/lib/ai/router";
import {
  AIUsageUnavailableError,
  finalizeAIRequest,
  reserveAIDailyQuestion,
  type AIDailyUsage,
} from "@/lib/ai/usage";

export type AIControllerResult =
  | { status: "success"; answer: string; usage: AIDailyUsage }
  | { status: "daily_limit"; usage: AIDailyUsage }
  | { status: "error"; code: string };

export async function executeContextualAIRequest(input: {
  supabase: SupabaseClient<Database>;
  contextType: AIContextType;
  contextId: string;
  language: Language;
  request: AIRequest;
}, providers: AIProvider[] = getConfiguredAIProviders()): Promise<AIControllerResult> {
  if (providers.length === 0) {
    console.error("[AI] no providers configured", {
      contextType: input.contextType,
      contextId: input.contextId,
    });
    return { status: "error", code: "AI_CONFIGURATION_ERROR" };
  }

  const requestId = globalThis.crypto.randomUUID();
  console.info("[AI] request started", { requestId, contextType: input.contextType });
  let reservation: Awaited<ReturnType<typeof reserveAIDailyQuestion>>;
  try {
    reservation = await reserveAIDailyQuestion(
      input.supabase,
      requestId,
      input.contextType,
      input.language
    );
  } catch (error) {
    if (!(error instanceof AIUsageUnavailableError)) {
      console.error("[AI] unexpected quota reservation failure", {
        contextType: input.contextType,
        errorName: error instanceof Error ? error.name : "unknown",
      });
      return { status: "error", code: "AI_INTERNAL_ERROR" };
    }
    return { status: "error", code: "AI_QUOTA_DATABASE_ERROR" };
  }

  if (!reservation.allowed) return { status: "daily_limit", usage: reservation.usage };
  if (!reservation.requestId) {
    console.error("[AI] quota reservation did not return its request id.", {
      contextType: input.contextType,
      contextId: input.contextId,
    });
    return { status: "error", code: "AI_QUOTA_DATABASE_ERROR" };
  }

  console.info("[AI] daily usage reservation passed", {
    requestId,
    contextType: input.contextType,
    remaining: reservation.usage.remaining,
  });
  const startedAt = Date.now();
  try {
    const result = await generateAIResponse(input.request, providers);
    await finalizeAIRequest(input.supabase, reservation.requestId, {
      status: "succeeded",
      provider: result.provider,
      model: result.model,
      errorCode: null,
      responseTimeMs: Date.now() - startedAt,
      attempts: result.attempts,
    });
    return { status: "success", answer: result.response, usage: reservation.usage };
  } catch (error) {
    const code = error instanceof AIGenerationError ? error.code : "AI_UNKNOWN_ERROR";
    const attempts = error instanceof AIGenerationError ? error.attempts : [];
    await finalizeAIRequest(input.supabase, reservation.requestId, {
      status: "failed",
      provider: null,
      model: null,
      errorCode: code,
      responseTimeMs: Date.now() - startedAt,
      attempts,
    });
    return { status: "error", code };
  }
}
