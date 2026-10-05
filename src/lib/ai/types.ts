import type { Language } from "@/i18n";

export type AIProviderName = "gemini" | "groq" | "openrouter";
export type AIContextType = "lesson" | "project";
export type AIMessage = { role: "user" | "model"; content: string };

export type AIRequest = {
  systemPrompt: string;
  userMessage: string;
  context?: string;
  messages?: AIMessage[];
  contextType: AIContextType;
  language: Language;
};

export type AIProviderResult = {
  provider: AIProviderName;
  model: string;
  response: string;
};

export type AIProviderErrorCode =
  | "AI_CONFIGURATION_ERROR"
  | "AI_AUTH_ERROR"
  | "AI_RATE_LIMITED"
  | "AI_QUOTA_EXCEEDED"
  | "AI_MODEL_UNAVAILABLE"
  | "AI_TIMEOUT"
  | "AI_PROVIDER_ERROR"
  | "AI_UNKNOWN_ERROR";

export type AIProviderAttempt = {
  provider: AIProviderName;
  model: string;
  status: "succeeded" | "failed";
  errorCode: AIProviderErrorCode | null;
  responseTimeMs: number;
};

export interface AIProvider {
  readonly name: AIProviderName;
  isConfigured(): boolean;
  getModel(): string | null;
  generateResponse(input: AIRequest, timeoutMs: number): Promise<AIProviderResult>;
}

export class AIProviderError extends Error {
  constructor(
    readonly code: AIProviderErrorCode,
    readonly retryable: boolean,
    readonly provider: AIProviderName,
    readonly model: string
  ) {
    super(`${provider} returned ${code}`);
    this.name = "AIProviderError";
  }
}

export function isAIProviderError(value: unknown): value is AIProviderError {
  if (typeof value !== "object" || value === null) return false;
  return (
    "code" in value &&
    typeof value.code === "string" &&
    [
      "AI_CONFIGURATION_ERROR",
      "AI_AUTH_ERROR",
      "AI_RATE_LIMITED",
      "AI_QUOTA_EXCEEDED",
      "AI_MODEL_UNAVAILABLE",
      "AI_TIMEOUT",
      "AI_PROVIDER_ERROR",
      "AI_UNKNOWN_ERROR",
    ].includes(value.code) &&
    "provider" in value &&
    ["gemini", "groq", "openrouter"].includes(String(value.provider)) &&
    "model" in value &&
    typeof value.model === "string" &&
    "retryable" in value &&
    typeof value.retryable === "boolean"
  );
}

export class AIGenerationError extends Error {
  constructor(
    readonly code: AIProviderErrorCode | "AI_CONFIGURATION_ERROR",
    readonly attempts: AIProviderAttempt[]
  ) {
    super("No configured AI provider could complete the request.");
    this.name = "AIGenerationError";
  }
}
