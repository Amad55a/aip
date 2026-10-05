import type { AIProvider, AIProviderName } from "@/lib/ai/types";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { groqProvider } from "@/lib/ai/providers/groq";
import { openRouterProvider } from "@/lib/ai/providers/openrouter";
import { getProviderOrder } from "@/lib/ai/providers/shared";

const providers: Record<AIProviderName, AIProvider> = {
  gemini: geminiProvider,
  groq: groqProvider,
  openrouter: openRouterProvider,
};

const keyEnvNames: Record<AIProviderName, string> = {
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};
const modelEnvNames: Record<AIProviderName, string> = {
  gemini: "GEMINI_MODEL",
  groq: "GROQ_MODEL",
  openrouter: "OPENROUTER_MODEL",
};

export function getConfiguredAIProviders() {
  return getProviderOrder().map((name) => {
    const provider = providers[name];
    if (provider.isConfigured()) return provider;
    if (process.env[keyEnvNames[name]]?.trim() && !provider.getModel()) {
      console.error("[AI] provider model is missing", {
        provider: provider.name,
        modelEnvName: modelEnvNames[name],
      });
    } else if (!process.env[keyEnvNames[name]]?.trim() && provider.getModel()) {
      console.error("[AI] provider API key is missing", {
        provider: provider.name,
        keyEnvName: keyEnvNames[name],
      });
    }
    return null;
  }).filter((provider): provider is AIProvider => provider !== null);
}
