import {
  AIProviderError,
  type AIProviderName,
  type AIRequest,
} from "@/lib/ai/types";

export type ProviderConfig = {
  name: AIProviderName;
  keyName: string;
  modelName: string;
  defaultModel?: string;
  endpoint: string;
};

export function getProviderModel(config: ProviderConfig) {
  return process.env[config.modelName]?.trim() || config.defaultModel || null;
}

export function isProviderConfigured(config: ProviderConfig) {
  return Boolean(process.env[config.keyName]?.trim() && getProviderModel(config));
}

export function getProviderKey(config: ProviderConfig) {
  return process.env[config.keyName]?.trim() ?? "";
}

export function getProviderTimeoutMs() {
  const configured = Number(process.env.AI_PROVIDER_TIMEOUT_MS ?? "20000");
  return Number.isInteger(configured) && configured >= 1000 && configured <= 120000
    ? configured
    : 20000;
}

export function getProviderOrder() {
  const validNames = new Set(["gemini", "groq", "openrouter"]);
  const configured = process.env.AI_PROVIDER_ORDER?.split(",")
    .map((provider) => provider.trim().toLowerCase())
    .filter((provider): provider is AIProviderName => validNames.has(provider));
  return configured?.length
    ? [...new Set(configured)]
    : ["gemini", "groq", "openrouter"] as AIProviderName[];
}

export function parseProviderErrorCode(status: number) {
  if (status === 401 || status === 403) return "AI_AUTH_ERROR" as const;
  if (status === 429) return "AI_RATE_LIMITED" as const;
  if (status === 404) return "AI_MODEL_UNAVAILABLE" as const;
  if (status === 408 || status === 504) return "AI_TIMEOUT" as const;
  return "AI_PROVIDER_ERROR" as const;
}

export async function throwProviderHttpError(
  response: Response,
  provider: AIProviderName,
  model: string
): Promise<never> {
  let code: import("@/lib/ai/types").AIProviderErrorCode = parseProviderErrorCode(response.status);
  if (response.status === 429) {
    const body = await response.clone().text().catch(() => "");
    if (/quota|resource_exhausted/i.test(body)) code = "AI_QUOTA_EXCEEDED";
  }
  throw new AIProviderError(
    code,
    code !== "AI_AUTH_ERROR",
    provider,
    model
  );
}

export function getMessageContent(input: AIRequest) {
  return input.messages?.length
    ? input.messages.map(({ role, content }) => ({
        role: role === "model" ? "assistant" : "user",
        content,
      }))
    : [{ role: "user", content: input.userMessage }];
}

export function asProviderError(
  error: unknown,
  provider: AIProviderName,
  model: string
) {
  if (error instanceof AIProviderError) return error;
  const timedOut =
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError");
  return new AIProviderError(
    timedOut ? "AI_TIMEOUT" : "AI_PROVIDER_ERROR",
    true,
    provider,
    model
  );
}
