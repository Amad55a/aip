import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

function transpileAndEval(filePath) {
  const fullPath = path.resolve(filePath);
  const code = fs.readFileSync(fullPath, "utf8");
  const js = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  const customRequire = (id) => {
    if (id.startsWith("@/")) {
      return transpileAndEval(path.resolve("./src", id.slice(2) + (path.extname(id) ? "" : ".ts")));
    }
    if (id.startsWith(".")) {
      return transpileAndEval(path.resolve(path.dirname(fullPath), id + (path.extname(id) ? "" : ".ts")));
    }
    return import(id);
  };
  const fn = new Function("module", "exports", "require", "__dirname", "__filename", js);
  fn(mod, mod.exports, customRequire, path.dirname(fullPath), fullPath);
  return mod.exports;
}

console.log("=== TechPath AI Supabase Auth Test Suite ===");

// 1. Validation Tests
console.log("\n[1/5] Testing Auth Validation Logic...");
const { validateSignIn, validateSignUp, isValidEmail, isStrongPassword } = transpileAndEval("./src/lib/auth/validation.ts");

assert.strictEqual(isValidEmail("test@example.com"), true);
assert.strictEqual(isValidEmail("not-an-email"), false);
assert.strictEqual(isStrongPassword("Password123"), true);
assert.strictEqual(isStrongPassword("  Password123  "), true);
assert.strictEqual(isStrongPassword("short1"), false);
assert.strictEqual(isStrongPassword("nonumbershere"), false);
assert.strictEqual(isStrongPassword("    "), false);

const emptySignIn = validateSignIn({ email: "", password: "" });
assert.strictEqual(emptySignIn.email, "auth.errors.emailRequired");
assert.strictEqual(emptySignIn.password, "auth.errors.passwordRequired");

const whitespaceSignIn = validateSignIn({ email: "  test@example.com  ", password: "   " });
assert.strictEqual(whitespaceSignIn.email, undefined);
assert.strictEqual(whitespaceSignIn.password, "auth.errors.passwordRequired");

const invalidSignIn = validateSignIn({ email: "invalid-email", password: "123" });
assert.strictEqual(invalidSignIn.email, "auth.errors.emailInvalid");

const emptySignUp = validateSignUp({ fullName: "", email: "", password: "" });
assert.strictEqual(emptySignUp.fullName, "auth.errors.fullNameRequired");
assert.strictEqual(emptySignUp.email, "auth.errors.emailRequired");
assert.strictEqual(emptySignUp.password, "auth.errors.passwordRequired");

const shortNameSignUp = validateSignUp({ fullName: "A", email: "test@example.com", password: "Password123" });
assert.strictEqual(shortNameSignUp.fullName, "auth.errors.fullNameMin");

const weakPassSignUp = validateSignUp({ fullName: "Ahmed", email: "test@example.com", password: "weak" });
assert.strictEqual(weakPassSignUp.password, "auth.errors.passwordWeak");

const whitespacePassSignUp = validateSignUp({ fullName: " Ahmed ", email: "  test@example.com ", password: "    " });
assert.strictEqual(whitespacePassSignUp.password, "auth.errors.passwordRequired");

const validSignUp = validateSignUp({ fullName: "Ahmed Abdullahi", email: "ahmed@example.com", password: "Password123" });
assert.deepStrictEqual(validSignUp, {});
console.log("✓ Validation logic verified.");

// 2. Auth Error Key Mapping Tests
console.log("\n[2/5] Testing Auth Error Key Mapping...");
const { getAuthErrorKey } = transpileAndEval("./src/lib/auth/errors.ts");

assert.strictEqual(getAuthErrorKey({ code: "invalid_credentials" }), "auth.errors.invalidCredentials");
assert.strictEqual(getAuthErrorKey({ message: "Invalid login credentials" }), "auth.errors.invalidCredentials");
assert.strictEqual(getAuthErrorKey({ code: "user_already_exists" }), "auth.errors.emailExists");
assert.strictEqual(getAuthErrorKey({ message: "User already registered" }), "auth.errors.emailExists");
assert.strictEqual(getAuthErrorKey({ code: "weak_password" }), "auth.errors.passwordTooWeak");
assert.strictEqual(getAuthErrorKey(new Error("Failed to fetch")), "auth.errors.network");
assert.strictEqual(getAuthErrorKey({ code: "oauth_provider_error" }), "auth.errors.oauthFailed");
assert.strictEqual(getAuthErrorKey(null), "auth.errors.unknown");
console.log("✓ Auth error key mappings verified.");

// 3. Route Access Tests
console.log("\n[3/6] Testing Authenticated and Protected Routes...");
const {
  canonicalProductionHost,
  getAuthCallbackUrl,
  isProtectedRoute,
  isGuestOnlyRoute,
  safeInternalPath,
} = transpileAndEval("./src/lib/auth/routes.ts");

assert.strictEqual(isProtectedRoute("/dashboard"), true);
assert.strictEqual(isProtectedRoute("/dashboard/"), true);
assert.strictEqual(isProtectedRoute("/dashboard/settings"), true);
assert.strictEqual(isProtectedRoute("/profile"), true);
assert.strictEqual(isProtectedRoute("/profile/settings"), true);
assert.strictEqual(isProtectedRoute("/profiled"), false);
assert.strictEqual(isProtectedRoute("/"), false);
assert.strictEqual(isGuestOnlyRoute("/"), true);
assert.strictEqual(isGuestOnlyRoute("/signin"), true);
assert.strictEqual(isGuestOnlyRoute("/signup"), true);
assert.strictEqual(isGuestOnlyRoute("/dashboard"), false);
assert.strictEqual(canonicalProductionHost("www.techpathai.tech"), "techpathai.tech");
assert.strictEqual(canonicalProductionHost("techpathai.tech"), null);
assert.strictEqual(canonicalProductionHost("localhost"), null);
assert.strictEqual(
  getAuthCallbackUrl("https://www.techpathai.tech"),
  "https://techpathai.tech/auth/callback"
);
assert.strictEqual(
  getAuthCallbackUrl("http://localhost:3000"),
  "http://localhost:3000/auth/callback"
);
assert.strictEqual(safeInternalPath("/learn/html?tab=lesson#content"), "/learn/html?tab=lesson#content");
assert.strictEqual(safeInternalPath("//evil.example/path"), "/dashboard");
assert.strictEqual(safeInternalPath("/\\\\evil.example/path"), "/dashboard");
console.log("✓ Public, guest-only, dashboard, and profile routes verified.");

// 4. Profile Fields Extraction Tests
console.log("\n[4/6] Testing Profile Extraction from Metadata...");
const { profileFieldsFromUser } = transpileAndEval("./src/lib/auth/profile.ts");

const emailUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "developer@example.com",
  user_metadata: { full_name: "Ahmed Abdullahi" },
};
assert.deepStrictEqual(profileFieldsFromUser(emailUser), {
  id: "00000000-0000-0000-0000-000000000001",
  full_name: "Ahmed Abdullahi",
  avatar_url: null,
});

const googleUser = {
  id: "00000000-0000-0000-0000-000000000002",
  email: "google.user@gmail.com",
  user_metadata: { name: "Google Developer", picture: "https://lh3.googleusercontent.com/avatar.jpg" },
};
assert.deepStrictEqual(profileFieldsFromUser(googleUser), {
  id: "00000000-0000-0000-0000-000000000002",
  full_name: "Google Developer",
  avatar_url: "https://lh3.googleusercontent.com/avatar.jpg",
});

const githubUser = {
  id: "00000000-0000-0000-0000-000000000003",
  email: "github.dev@users.noreply.github.com",
  user_metadata: { user_name: "githubdev", avatar_url: "https://avatars.githubusercontent.com/u/12345" },
};
assert.deepStrictEqual(profileFieldsFromUser(githubUser), {
  id: "00000000-0000-0000-0000-000000000003",
  full_name: "githubdev",
  avatar_url: "https://avatars.githubusercontent.com/u/12345",
});

const fallbackUser = {
  id: "00000000-0000-0000-0000-000000000004",
  email: "coder@domain.com",
  user_metadata: {},
};
assert.deepStrictEqual(profileFieldsFromUser(fallbackUser), {
  id: "00000000-0000-0000-0000-000000000004",
  full_name: "coder",
  avatar_url: null,
});
console.log("✓ Profile extraction and fallback handling verified.");

// 5. i18n and RTL Tests
console.log("\n[5/6] Testing Language Translations and Direction...");
const en = transpileAndEval("./src/i18n/en.ts").default;
const ar = transpileAndEval("./src/i18n/ar.ts").default;
const so = transpileAndEval("./src/i18n/so.ts").default;
const { RTL_LANGUAGES } = transpileAndEval("./src/i18n/index.ts");

assert.ok(RTL_LANGUAGES.includes("ar"), "Arabic must be in RTL_LANGUAGES");
assert.ok(!RTL_LANGUAGES.includes("en"), "English must be LTR");
assert.ok(!RTL_LANGUAGES.includes("so"), "Somali must be LTR");

const requiredPaths = [
  "navbar.dashboard",
  "navbar.profile",
  "navbar.signOut",
  "navbar.signIn",
  "navbar.getStarted",
  "auth.signIn.title",
  "auth.signIn.email",
  "auth.signIn.password",
  "auth.signIn.submit",
  "auth.signIn.google",
  "auth.signIn.github",
  "auth.signUp.title",
  "auth.signUp.fullName",
  "auth.signUp.email",
  "auth.signUp.password",
  "auth.signUp.submit",
  "auth.signUp.google",
  "auth.signUp.github",
  "auth.signUp.confirmEmail",
  "auth.loading.signingIn",
  "auth.loading.creatingAccount",
  "auth.loading.connecting",
  "auth.errors.emailRequired",
  "auth.errors.emailInvalid",
  "auth.errors.passwordRequired",
  "auth.errors.passwordWeak",
  "auth.errors.emailExists",
  "auth.errors.invalidCredentials",
  "auth.errors.oauthFailed",
  "dashboard.title",
  "dashboard.welcomeBack",
  "dashboard.email",
  "dashboard.userId",
  "dashboard.signOut",
  "dashboard.accountInfo",
  "common.switchToLightMode",
  "common.switchToDarkMode",
  "appShell.profilePage.title",
  "appShell.aiUsage.remaining",
  "appShell.aiUsage.limitReached",
  "appShell.aiUsage.loadingError",
  "appShell.aiUsage.signInRequired",
  "appShell.errors.requestFailed",
  "appShell.lessonContent.questionProgress",
  "appShell.lessonContent.nextQuestion",
  "appShell.lessonContent.previousQuestion",
  "appShell.lessonContent.retryQuiz",
  "appShell.lessonContent.progressUpdateError",
  "appShell.learn.catalogTitle",
  "appShell.learn.courseCount",
];

function getByPath(obj, pathStr) {
  return pathStr.split(".").reduce((acc, k) => acc?.[k], obj);
}

for (const p of requiredPaths) {
  assert.ok(typeof getByPath(en, p) === "string" && getByPath(en, p).length > 0, `Missing in EN: ${p}`);
  assert.ok(typeof getByPath(ar, p) === "string" && getByPath(ar, p).length > 0, `Missing in AR: ${p}`);
  assert.ok(typeof getByPath(so, p) === "string" && getByPath(so, p).length > 0, `Missing in SO: ${p}`);
}
console.log(`✓ All ${requiredPaths.length} required keys verified across English, Arabic (RTL), and Somali.`);
assert.ok(en.appShell.aiUsage.limitReached.includes("{limit}"));
assert.ok(so.appShell.aiUsage.limitReached.includes("{limit}"));
assert.ok(ar.appShell.aiUsage.limitReached.includes("{limit}"));
assert.notStrictEqual(ar.appShell.aiUsage.limitReached, en.appShell.aiUsage.limitReached);
assert.notStrictEqual(so.appShell.aiUsage.limitReached, en.appShell.aiUsage.limitReached);
assert.ok(en.auth.errors.sessionFailed);
assert.ok(ar.auth.errors.sessionFailed);
assert.ok(so.auth.errors.sessionFailed);
console.log("✓ Profile, quiz, roadmap, RTL theme, and localized AI quota messages verified.");

const { getAIDailyLimit } = transpileAndEval("./src/lib/ai/usage.ts");
assert.strictEqual(getAIDailyLimit(), 5);
console.log("✓ Shared AI quota defaults to 5 questions per UTC day.");

const { generateAIResponse } = transpileAndEval("./src/lib/ai/router.ts");
const { AIProviderError } = transpileAndEval("./src/lib/ai/types.ts");
const providerOrder = [];
const provider = (name, generateResponse) => ({
  name,
  isConfigured: () => true,
  getModel: () => `${name}-test-model`,
  generateResponse,
});
const fallbackResult = await generateAIResponse(
  {
    systemPrompt: "You are a contextual tutor.",
    userMessage: "What is HTML?",
    contextType: "lesson",
    language: "en",
  },
  [
    provider("gemini", async () => {
      providerOrder.push("gemini");
      throw new AIProviderError("AI_RATE_LIMITED", true, "gemini", "gemini-test-model");
    }),
    provider("groq", async () => {
      providerOrder.push("groq");
      return { provider: "groq", model: "groq-test-model", response: "HTML structures a page." };
    }),
  ]
);
assert.deepStrictEqual(providerOrder, ["gemini", "groq"]);
assert.strictEqual(fallbackResult.provider, "groq");
assert.deepStrictEqual(
  fallbackResult.attempts.map((attempt) => attempt.status),
  ["failed", "succeeded"]
);
const allProviderOrder = [];
await assert.rejects(
  generateAIResponse(
  {
    systemPrompt: "Teach carefully.",
    userMessage: "Help me debug.",
    contextType: "project",
    language: "ar",
  },
    [
      ...["gemini", "groq", "openrouter"].map((name) =>
        provider(name, async () => {
          allProviderOrder.push(name);
          throw new AIProviderError("AI_RATE_LIMITED", true, name, `${name}-test-model`);
        })
      ),
    ]
  ),
  (error) => error.code === "AI_RATE_LIMITED" && error.attempts.length === 3
);
assert.deepStrictEqual(allProviderOrder, ["gemini", "groq", "openrouter"]);
await assert.rejects(
  generateAIResponse(
    {
      systemPrompt: "System",
      userMessage: "Question",
      contextType: "project",
      language: "so",
    },
    [
      provider("gemini", async () => {
        throw new AIProviderError("AI_TIMEOUT", true, "gemini", "gemini-test-model");
      }),
    ]
  ),
  (error) => error.code === "AI_TIMEOUT" && error.attempts.length === 1
);
await assert.rejects(
  generateAIResponse(
    {
      systemPrompt: "System",
      userMessage: "Question",
      contextType: "lesson",
      language: "en",
    },
    []
  ),
  (error) => error.code === "AI_CONFIGURATION_ERROR"
);
console.log("✓ Provider fallback uses one application request and records normalized provider attempts.");

const configuredProviderEnv = {
  GEMINI_API_KEY: "test-gemini-key",
  GROQ_API_KEY: "test-groq-key",
  GROQ_MODEL: "groq-test-model",
  OPENROUTER_API_KEY: "test-openrouter-key",
  OPENROUTER_MODEL: "openrouter/test-free-model",
  AI_PROVIDER_ORDER: "gemini,groq,openrouter",
};
for (const [name, value] of Object.entries(configuredProviderEnv)) process.env[name] = value;
const configuredProviders = [
  transpileAndEval("./src/lib/ai/providers/gemini.ts").geminiProvider,
  transpileAndEval("./src/lib/ai/providers/groq.ts").groqProvider,
  transpileAndEval("./src/lib/ai/providers/openrouter.ts").openRouterProvider,
];
const originalFetch = globalThis.fetch;
const providerRequests = [];
globalThis.fetch = async (url, init) => {
  providerRequests.push({ url: String(url), init });
  const body = String(url).includes("generativelanguage")
    ? { candidates: [{ content: { parts: [{ text: "Provider answer" }] } }] }
    : { choices: [{ message: { content: "Provider answer" } }] };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
try {
  for (const configuredProvider of configuredProviders) {
    const response = await configuredProvider.generateResponse(
      {
        systemPrompt: "Respond in Somali. Keep code unchanged.",
        userMessage: "Waa maxay HTML?",
        contextType: "lesson",
        language: "so",
      },
      1000
    );
    assert.strictEqual(response.provider, configuredProvider.name);
    assert.strictEqual(response.response, "Provider answer");
  }
  assert.strictEqual(providerRequests.length, 3);
  assert.ok(providerRequests.some((request) => request.url.includes("generativelanguage.googleapis.com")));
  assert.ok(providerRequests.some((request) => request.url.includes("api.groq.com")));
  assert.ok(providerRequests.some((request) => request.url.includes("openrouter.ai")));
} finally {
  globalThis.fetch = originalFetch;
}
globalThis.fetch = async () => new Response(
  JSON.stringify({ error: { status: "RESOURCE_EXHAUSTED" } }),
  { status: 429, headers: { "Content-Type": "application/json" } }
);
try {
  await assert.rejects(
    configuredProviders[0].generateResponse(
      { systemPrompt: "System", userMessage: "Question", contextType: "lesson", language: "en" },
      1000
    ),
    (error) => error.code === "AI_QUOTA_EXCEEDED"
  );
} finally {
  globalThis.fetch = originalFetch;
}
console.log("✓ Gemini, Groq, and OpenRouter adapters pass mocked protocol tests.");

const quotaMigration = fs.readFileSync(
  "./supabase/migrations/20261005040000_harden_ai_quota_and_log_requests.sql",
  "utf8"
);
assert.ok(quotaMigration.includes("create or replace function public.reserve_ai_question"));
assert.ok(quotaMigration.includes("create or replace function public.get_ai_usage(p_daily_limit integer)"));
assert.ok(quotaMigration.includes("p_daily_limit is distinct from 5"));
assert.ok(quotaMigration.includes("au.question_count < p_daily_limit"));
assert.ok(quotaMigration.includes("create table if not exists public.ai_requests"));
assert.ok(quotaMigration.includes("create table if not exists public.ai_provider_attempts"));
assert.ok(quotaMigration.includes("grant execute on function public.finalize_ai_request"));
assert.ok(!quotaMigration.includes("cerebras"));
const quotaRepairMigration = fs.readFileSync(
  "./supabase/migrations/20261005050000_restore_ai_quota_reservation_rpc.sql",
  "utf8"
);
assert.ok(quotaRepairMigration.includes(
  "create or replace function public.reserve_ai_question(\n  p_daily_limit integer,\n  p_request_id uuid,\n  p_context_type text,\n  p_language text"
));
assert.ok(quotaRepairMigration.includes("create table if not exists public.ai_requests"));
assert.ok(quotaRepairMigration.includes("create table if not exists public.ai_provider_attempts"));
assert.ok(quotaRepairMigration.includes("create or replace function public.get_ai_usage(p_daily_limit integer)"));
assert.ok(quotaRepairMigration.includes("p_daily_limit is distinct from 5"));
assert.ok(quotaRepairMigration.includes("alter table public.ai_requests enable row level security"));
assert.ok(quotaRepairMigration.includes(
  "revoke all on public.ai_requests, public.ai_provider_attempts\n  from public, anon, authenticated"
));
assert.ok(quotaRepairMigration.includes("#variable_conflict use_column"));
assert.ok(quotaRepairMigration.includes("au.question_count < p_daily_limit"));
assert.ok(quotaRepairMigration.includes("create or replace function public.finalize_ai_request"));
assert.ok(!quotaRepairMigration.includes("cerebras"));
assert.ok(quotaRepairMigration.includes(
  "grant execute on function public.reserve_ai_question(integer, uuid, text, text) to authenticated"
));
assert.ok(quotaRepairMigration.includes("notify pgrst, 'reload schema'"));
console.log("✓ Database migration contains atomic reservation, private request logs, and server RPC grants.");

const {
  reserveAIDailyQuestion,
  finalizeAIRequest,
} = transpileAndEval("./src/lib/ai/usage.ts");
const rpcCalls = [];
const mockSupabase = {
  rpc: async (name, args) => {
    rpcCalls.push({ name, args });
    if (name === "reserve_ai_question") {
      return {
        data: [{
          request_id: "request-id",
          usage_date: "2026-10-05",
          question_count: 1,
          daily_limit: 5,
          remaining_count: 4,
          allowed: true,
        }],
        error: null,
      };
    }
    return { data: true, error: null };
  },
};
const reservation = await reserveAIDailyQuestion(
  mockSupabase,
  "request-id",
  "lesson",
  "so"
);
assert.strictEqual(reservation.allowed, true);
assert.strictEqual(reservation.usage.remaining, 4);
assert.strictEqual(rpcCalls.length, 1);
assert.deepStrictEqual(
  {
    dailyLimit: rpcCalls[0].args.p_daily_limit,
    context: rpcCalls[0].args.p_context_type,
    language: rpcCalls[0].args.p_language,
  },
  { dailyLimit: 5, context: "lesson", language: "so" }
);
const originalConsoleError = console.error;
const quotaErrorLogs = [];
console.error = (...args) => quotaErrorLogs.push(args.join(" "));
try {
  const failingSupabase = {
    rpc: async () => ({
      data: null,
      error: {
        code: "PGRST202",
        message: "Could not find the function public.reserve_ai_question",
        details: "Function missing from schema cache",
        hint: null,
      },
    }),
  };
  await assert.rejects(
    reserveAIDailyQuestion(
      failingSupabase,
      "request-id",
      "lesson",
      "en"
    ),
    (error) => error.name === "AIUsageUnavailableError"
  );
} finally {
  console.error = originalConsoleError;
}
assert.ok(quotaErrorLogs.join("\n").includes("PGRST202"));
assert.ok(quotaErrorLogs.join("\n").includes("reserve_ai_question"));
console.log("✓ Quota RPC failures retain safe Supabase diagnostics in server logs.");
assert.strictEqual(
  await finalizeAIRequest(mockSupabase, "request-id", {
    status: "failed",
    provider: null,
    model: null,
    errorCode: "AI_PROVIDER_ERROR",
    responseTimeMs: 10,
    attempts: [{
      provider: "gemini",
      model: "gemini-test-model",
      status: "failed",
      errorCode: "AI_RATE_LIMITED",
      responseTimeMs: 10,
    }],
  }),
  true
);
assert.strictEqual(rpcCalls[1].name, "finalize_ai_request");
assert.ok(!("p_refund" in rpcCalls[1].args));
assert.deepStrictEqual(rpcCalls[1].args.p_attempts, [{
  provider: "gemini",
  model: "gemini-test-model",
  status: "failed",
  error_code: "AI_RATE_LIMITED",
  response_time_ms: 10,
}]);
console.log("✓ One authenticated reservation covers all provider attempts without client-callable refunds.");

const { calculateProgress } = transpileAndEval("./src/lib/learning/progress.ts");
assert.deepStrictEqual(calculateProgress(3, 10), { completed: 3, total: 10, percent: 30 });
assert.deepStrictEqual(calculateProgress(0, 0), { completed: 0, total: 0, percent: 0 });
assert.deepStrictEqual(calculateProgress(12, 10), { completed: 10, total: 10, percent: 100 });
console.log("✓ Shared lesson progress calculations verified (including 3/10 = 30%).");

// 6. Supabase Environment Configuration
console.log("\n[6/6] Testing Supabase Client Architecture & Environment Helpers...");
const { isSupabaseConfigured, getSupabaseUrl, getSupabaseAnonKey } = transpileAndEval("./src/lib/supabase/env.ts");

assert.strictEqual(isSupabaseConfigured(), false);
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example-project.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key-12345";
assert.strictEqual(isSupabaseConfigured(), true);
assert.strictEqual(getSupabaseUrl(), "https://example-project.supabase.co");
assert.strictEqual(getSupabaseAnonKey(), "test-anon-key-12345");
console.log("✓ Environment helpers verified.");

console.log("\n==================================================");
console.log("ALL UNIT TESTS PASSED SUCCESSFULLY! (6/6)");
console.log("==================================================");
