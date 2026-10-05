import type { AIProvider, AIRequest, AIProviderResult, AIProviderName } from "@/lib/ai/types";
import {
  asProviderError,
  getMessageContent,
  getProviderKey,
  getProviderModel,
  isProviderConfigured,
  throwProviderHttpError,
  type ProviderConfig,
} from "@/lib/ai/providers/shared";

export function createOpenAICompatibleProvider(config: ProviderConfig): AIProvider {
  return {
    name: config.name as AIProviderName,
    isConfigured: () => isProviderConfigured(config),
    getModel: () => getProviderModel(config),
    async generateResponse(input: AIRequest, timeoutMs: number): Promise<AIProviderResult> {
      const model = getProviderModel(config);
      if (!model || !isProviderConfigured(config)) {
        throw new Error(`${config.name} provider is not configured.`);
      }

      try {
        const response = await fetch(config.endpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getProviderKey(config)}`,
            "Content-Type": "application/json",
            ...(config.name === "openrouter"
              ? { "X-Title": "From Code to AI" }
              : {}),
          },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: input.systemPrompt },
              ...getMessageContent(input),
            ],
            temperature: 0.5,
            max_tokens: 800,
          }),
        });
        if (!response.ok) await throwProviderHttpError(response, config.name, model);

        const result: unknown = await response.json();
        const answer = extractOpenAIAnswer(result);
        if (!answer) throw new Error(`${config.name} returned no answer.`);
        return { provider: config.name, model, response: answer };
      } catch (error) {
        throw asProviderError(error, config.name, model);
      }
    },
  };
}

function extractOpenAIAnswer(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("choices" in value) || !Array.isArray(value.choices)) {
    return null;
  }
  const choice = value.choices[0];
  if (typeof choice !== "object" || choice === null || !("message" in choice)) return null;
  const message = choice.message;
  if (typeof message !== "object" || message === null || !("content" in message)) return null;
  if (typeof message.content === "string") return message.content.trim() || null;
  if (!Array.isArray(message.content)) return null;
  const parts: unknown[] = message.content;
  const text = parts
    .filter((part): part is { type: string; text: string } =>
      typeof part === "object" && part !== null && "text" in part &&
      typeof part.text === "string"
    )
    .map((part) => part.text)
    .join("\n")
    .trim();
  return text || null;
}
