import { createOpenAICompatibleProvider } from "@/lib/ai/providers/openai-compatible";

export const groqProvider = createOpenAICompatibleProvider({
  name: "groq",
  keyName: "GROQ_API_KEY",
  modelName: "GROQ_MODEL",
  endpoint: "https://api.groq.com/openai/v1/chat/completions",
});
