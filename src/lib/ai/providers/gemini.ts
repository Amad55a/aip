import type { AIProvider, AIRequest, AIProviderResult } from "@/lib/ai/types";
import {
  asProviderError,
  getProviderKey,
  getProviderModel,
  isProviderConfigured,
  throwProviderHttpError,
  type ProviderConfig,
} from "@/lib/ai/providers/shared";

const config: ProviderConfig = {
  name: "gemini",
  keyName: "GEMINI_API_KEY",
  modelName: "GEMINI_MODEL",
  defaultModel: "gemini-2.5-flash",
  endpoint: "https://generativelanguage.googleapis.com/v1beta/models",
};

export const geminiProvider: AIProvider = {
  name: config.name,
  isConfigured: () => isProviderConfigured(config),
  getModel: () => getProviderModel(config),
  async generateResponse(input: AIRequest, timeoutMs: number): Promise<AIProviderResult> {
    const model = getProviderModel(config);
    if (!model || !isProviderConfigured(config)) {
      throw new Error("Gemini provider is not configured.");
    }
    try {
      const response = await fetch(
        `${config.endpoint}/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": getProviderKey(config),
          },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: input.systemPrompt }] },
            contents: (input.messages?.length
              ? input.messages
              : [{ role: "user" as const, content: input.userMessage }]
            ).map(({ role, content }) => ({
              role: role === "model" ? "model" : "user",
              parts: [{ text: content }],
            })),
            generationConfig: { temperature: 0.5, maxOutputTokens: 800 },
          }),
        }
      );
      if (!response.ok) await throwProviderHttpError(response, config.name, model);
      const result: unknown = await response.json();
      const answer = extractGeminiAnswer(result);
      if (!answer) throw new Error("Gemini returned no answer.");
      return { provider: config.name, model, response: answer };
    } catch (error) {
      throw asProviderError(error, config.name, model);
    }
  },
};

function extractGeminiAnswer(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("candidates" in value)) return null;
  const candidates = value.candidates;
  if (!Array.isArray(candidates)) return null;
  const first = candidates[0];
  if (typeof first !== "object" || first === null || !("content" in first)) return null;
  const content = first.content;
  if (typeof content !== "object" || content === null || !("parts" in content) || !Array.isArray(content.parts)) return null;
  const parts: unknown[] = content.parts;
  const text = parts
    .filter((part): part is { text: string } =>
      typeof part === "object" && part !== null && "text" in part &&
      typeof part.text === "string"
    )
    .map((part) => part.text)
    .filter((part) => part.trim().length > 0)
    .join("\n");
  return text || null;
}
