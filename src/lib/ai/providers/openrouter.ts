import { createOpenAICompatibleProvider } from "@/lib/ai/providers/openai-compatible";

export const openRouterProvider = createOpenAICompatibleProvider({
  name: "openrouter",
  keyName: "OPENROUTER_API_KEY",
  modelName: "OPENROUTER_MODEL",
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
});
