import { AIGenerationError, AIProviderError, isAIProviderError, type AIProviderAttempt, type AIRequest } from "@/lib/ai/types";
import { getConfiguredAIProviders } from "@/lib/ai/providers/index";
import { getProviderTimeoutMs } from "@/lib/ai/providers/shared";

export async function generateAIResponse(
  input: AIRequest,
  configuredProviders = getConfiguredAIProviders()
) {
  const providers = configuredProviders;
  if (providers.length === 0) {
    console.error("[AI] no providers configured", {
      configuredOrder: process.env.AI_PROVIDER_ORDER ?? "gemini,groq,openrouter",
    });
    throw new AIGenerationError("AI_CONFIGURATION_ERROR", []);
  }

  const attempts: AIProviderAttempt[] = [];
  let lastError: AIProviderError | null = null;
  const timeoutMs = getProviderTimeoutMs();

  for (const provider of providers) {
    const model = provider.getModel() ?? "unconfigured";
    const startedAt = Date.now();
    try {
      const result = await provider.generateResponse(input, timeoutMs);
      attempts.push({
        provider: result.provider,
        model: result.model,
        status: "succeeded",
        errorCode: null,
        responseTimeMs: Date.now() - startedAt,
      });
      console.info("[AI] provider attempt succeeded", {
        contextType: input.contextType,
        provider: result.provider,
        model: result.model,
        responseTimeMs: Date.now() - startedAt,
      });
      return { ...result, attempts };
    } catch (error) {
      const normalized = isAIProviderError(error)
        ? error
        : new AIProviderError("AI_UNKNOWN_ERROR", false, provider.name, model);
      lastError = normalized;
      attempts.push({
        provider: normalized.provider,
        model: normalized.model,
        status: "failed",
        errorCode: normalized.code,
        responseTimeMs: Date.now() - startedAt,
      });
      console.error("[AI] provider attempt failed", {
        contextType: input.contextType,
        provider: normalized.provider,
        model: normalized.model,
        errorCode: normalized.code,
        retryable: normalized.retryable,
        responseTimeMs: Date.now() - startedAt,
      });
    }
  }

  throw new AIGenerationError(lastError?.code ?? "AI_PROVIDER_ERROR", attempts);
}
