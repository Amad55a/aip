# From Code to AI

**Learn. Build. Understand. Grow.**

A modern technology learning platform designed to guide learners from core programming fundamentals to artificial intelligence and beyond.

---

## Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **SSR / Cookie Management**: `@supabase/ssr` & `@supabase/supabase-js`
- **Internationalization (i18n)**: English (`en`), Arabic (`ar` with RTL), Somali (`so`)
- **Theme**: Light Mode (default) and Dark Mode with persistent preferences

---

## Supabase Setup Guide

Use the Supabase project already configured for the application in local
development and production. Only create a project if this application has not
been connected to Supabase yet; do not create a second project for deployment.

### 1. Create a Supabase Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New project** and choose your organization.
3. Choose a project name, secure database password, and region.

### 2. Retrieve Supabase API Credentials
1. In your Supabase project dashboard, navigate to **Project Settings** → **API**.
2. Copy the **Project URL**.
3. Copy the **anon / public** key (publishable API key safe for browser use).
> **Security Notice**: Never expose the `service_role` key in frontend code or client environment variables.

### 3. Configure Local Environment Variables
Create a `.env.local` file in the project root based on `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Fill in your project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

For contextual lesson and project AI, configure at least one provider key in
`.env.local`. Requests try Gemini first (`GEMINI_API_KEY`, optional
`GEMINI_MODEL`, default `gemini-2.5-flash`), then Groq
(`GROQ_API_KEY`, `GROQ_MODEL`), then OpenRouter (`OPENROUTER_API_KEY`,
`OPENROUTER_MODEL`). Choose active model IDs available to your provider
account; Groq and OpenRouter require an explicit model ID. Only providers with
both a key and model are enabled. `AI_PROVIDER_ORDER` can override the default
`gemini,groq,openrouter` order, and `AI_PROVIDER_TIMEOUT_MS` controls each
provider's timeout (default 20 seconds). Provider credentials must remain
server-side; never prefix them with `NEXT_PUBLIC_`.

For authenticated public-web search, configure `GOOGLE_SEARCH_API_KEY` and
`GOOGLE_SEARCH_ENGINE_ID` in `.env.local`. The API key is server-only and must
never use a `NEXT_PUBLIC_` prefix. This project uses the TechPath AI Programmable
Search Engine ID `615dccb62b5204d35`; the Search Engine must be configured to
search the public web, and the Google Custom Search API must be enabled for the
key's Google Cloud project.

Each authenticated user gets `5` shared questions per UTC calendar day across
lesson and project AI. The limit is enforced by PostgreSQL, not an environment
variable or browser count, so direct RPC calls cannot raise it. Each learner
question reserves one atomic database credit before any provider is called. If
all providers fail, the request and provider attempts are logged as failed.
Reservations are not refunded.

### 4. Run the Database Migrations
Apply every SQL migration in `supabase/migrations` in filename order. This creates the authenticated profile system and the published Web Development / MERN Stack curriculum:

- **Via Supabase Dashboard**:
  1. Go to **SQL Editor** in the Supabase Dashboard.
  2. Open and run [`supabase/migrations/20260410120000_create_profiles.sql`](./supabase/migrations/20260410120000_create_profiles.sql).
  3. Then open and run [`supabase/migrations/20261004212700_create_learning_curriculum.sql`](./supabase/migrations/20261004212700_create_learning_curriculum.sql).
  4. Then open and run [`supabase/migrations/20261004230000_add_lesson_content.sql`](./supabase/migrations/20261004230000_add_lesson_content.sql) to add structured lesson explanations, examples, notes, mistakes, and practice content.
  5. Then open and run [`supabase/migrations/20261004240000_add_learning_progress.sql`](./supabase/migrations/20261004240000_add_learning_progress.sql) to create user-scoped enrollments and lesson progress, including the HTML quiz questions.
  6. Then open and run [`supabase/migrations/20261004250000_add_project_completions.sql`](./supabase/migrations/20261004250000_add_project_completions.sql) to create user-scoped project completion tracking.
  7. Then open and run [`supabase/migrations/20261005010000_add_multilingual_learning_content.sql`](./supabase/migrations/20261005010000_add_multilingual_learning_content.sql) to add locale-aware curriculum fields and seed Somali and Arabic HTML foundations content.
  8. Then open and run [`supabase/migrations/20261005020000_add_ai_usage_and_search_indexes.sql`](./supabase/migrations/20261005020000_add_ai_usage_and_search_indexes.sql) to add atomic shared AI daily quotas, secure full-text search, and database-backed learning-path progress calculations. This migration requests a PostgREST schema-cache refresh after creating its RPCs.
  9. Then open and run [`supabase/migrations/20261005030000_seed_learning_path_catalog.sql`](./supabase/migrations/20261005030000_seed_learning_path_catalog.sql) to publish the Cybersecurity, English for Technology, and AI Engineering path overviews.
  10. Then run [`supabase/migrations/20261005040000_harden_ai_quota_and_log_requests.sql`](./supabase/migrations/20261005040000_harden_ai_quota_and_log_requests.sql) to reassert authenticated atomic quota RPC grants and add private AI request/provider-attempt logs.
  11. Then run [`supabase/migrations/20261005050000_restore_ai_quota_reservation_rpc.sql`](./supabase/migrations/20261005050000_restore_ai_quota_reservation_rpc.sql) to restore the reservation RPC and private request-log tables if an environment has migration-history drift, and refresh the PostgREST schema cache.
- **Via Supabase CLI** (if installed):
  ```bash
  supabase db push
  ```

For `PGRST202` errors naming `reserve_ai_question`, deploy the database migrations
before deploying the matching application build. After `supabase db push` (or
running the SQL files in order in the Dashboard), verify that this query returns
`reserve_ai_question(integer,uuid,text,text)` rather than `NULL`:

```sql
select to_regprocedure('public.reserve_ai_question(integer,uuid,text,text)');
```

Also verify that the request logs and finalizer exist:

```sql
select
  to_regclass('public.ai_requests') as ai_requests_table,
  to_regclass('public.ai_provider_attempts') as ai_provider_attempts_table,
  to_regprocedure('public.finalize_ai_request(uuid,text,text,text,text,integer,jsonb)') as finalizer;
```

The repair migration ensures the private AI request and provider-attempt tables
exist, replaces the obsolete one-argument reservation RPC, restores the atomic
four-argument reservation and finalization functions, reapplies their
authenticated grants, and notifies PostgREST to reload its schema cache. Run it
in SQL Editor if migration history is out of sync, then verify the reservation
signature and `ai_requests` table before retrying the app.

The curriculum migration creates:
- `learning_paths`, `courses`, `modules`, and `lessons`, with UUID keys, ordered relationships, timestamps, and foreign-key cascades.
- The initial published Web Development / MERN Stack path and its 15 ordered technology courses, levelled modules, and curriculum lessons.
- Row Level Security policies that allow authenticated users to read published curriculum only; client roles receive no curriculum write privileges.

The lesson content migration adds structured content fields and seeds the HTML lessons, including the first HTML lesson's explanation, example, sandboxed preview code, notes, common mistakes, and practice activities.

The multilingual content migration adds per-record `translations` JSON to the existing learning path, course, module, and lesson tables. The global language preference persists across reloads, controls server-rendered learning content, and sets the document's language and text direction. Lesson code samples remain unchanged while their surrounding explanations, examples, and quiz content use the selected locale when a translation is available.

The Learn catalog shows every published path. A path needs published courses,
modules, and lessons before learners can start it; the three additional path
records are overviews and their curricula still need authoring. AI usage is
reserved atomically in `public.ai_usage` before any configured provider is called and is shared
across lesson and project mentor requests. The SQL migration creates the
`search_learning_content` RPC and GIN full-text indexes over published
curriculum. Run and verify these migrations in each Supabase environment
before deploying the matching application build.

The learning progress migration adds `enrollments` and `lesson_progress` with
per-user RLS, unique user/path and user/lesson constraints, and server-graded
lesson quizzes. Path and module progress are calculated from completed lesson
records rather than stored as duplicate totals. Open a lesson's **Ask AI Mentor**
button to start a Gemini conversation grounded in that published lesson's
current path, course, module, and level.

The profiles migration sets up:
- `public.profiles` table with foreign key to `auth.users(id)` (`ON DELETE CASCADE`).
- `handle_new_user()` trigger to automatically create a profile when a new user signs up via Email or OAuth.
- Strict Row Level Security (RLS) policies so authenticated users can only view, create, and update their own profile.

### 5. Configure Google OAuth
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project, then configure the **OAuth consent screen**.
3. Navigate to **Credentials** → **Create Credentials** → **OAuth client ID**.
4. Select **Web application**.
5. Under **Authorized redirect URIs**, enter your Supabase Auth callback URI:
   ```
   https://<your-project-id>.supabase.co/auth/v1/callback
   ```
6. Copy the **Client ID** and **Client Secret**.
7. In the Supabase Dashboard, go to **Authentication** → **Providers** → **Google**.
8. Enable Google and paste the **Client ID** and **Client Secret**, then click **Save**.

### 6. Configure GitHub OAuth
1. Go to **GitHub Settings** → **Developer Settings** → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: TechPath AI
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**:
     ```
     https://<your-project-id>.supabase.co/auth/v1/callback
     ```
3. Register the application, then generate a **Client Secret**.
4. In the Supabase Dashboard, go to **Authentication** → **Providers** → **GitHub**.
5. Enable GitHub, paste the **Client ID** and **Client Secret**, then click **Save**.

### 7. Configure Redirect URLs in Supabase
1. In the Supabase Dashboard, navigate to **Authentication** → **URL Configuration**.
2. Set **Site URL**:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add the callback paths under **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback` (for production deployments)

### 8. Run the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Authentication Flow & Security

- **Client/Server Separation**:
  - `src/lib/supabase/client.ts`: Browser singleton client for Client Components.
  - `src/lib/supabase/server.ts`: Server client with secure cookie forwarding for Server Components and Route Handlers.
  - `src/lib/supabase/middleware.ts` / `src/proxy.ts`: Session refresh and route protection.
- **Route Protection**:
  - `/dashboard` and `/profile` (including nested routes): Protected. Unauthenticated users are redirected to `/signin`, including when Supabase is not configured.
  - `/`, `/signin`, and `/signup`: Signed-in users are redirected to `/dashboard`.
- **Row Level Security (RLS)**:
  - Enabled on `public.profiles`.
  - Policies enforce `profiles.id = auth.uid()` for `SELECT`, `INSERT`, and `UPDATE`.
- **Password Security**:
  - Managed exclusively by Supabase Auth with secure hashing (bcrypt/Argon2).
  - No plaintext or custom-hashed passwords are stored or handled by application code.

## Production Deployment

1. Push the reviewed source to the GitHub `main` branch and import that
   repository into Vercel as a Next.js project.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the
   Vercel Development, Preview, and Production environments. Set
   `NEXT_PUBLIC_SITE_URL` to the canonical production origin (for example,
   `https://your-domain.com`) in Production so the sitemap and metadata use
   the real site URL.
3. Add server-only `GEMINI_API_KEY` and `GEMINI_MODEL`; add `GROQ_API_KEY`,
   `GROQ_MODEL`, `OPENROUTER_API_KEY`, and `OPENROUTER_MODEL` for configured
   fallbacks. Use model IDs supported by the corresponding accounts. Never
   create `NEXT_PUBLIC_*` AI credentials.
4. To enable Web Search, add `GOOGLE_SEARCH_API_KEY` and
   `GOOGLE_SEARCH_ENGINE_ID` to **Vercel → Project → Settings → Environment
   Variables → Production**. Use the Google API key from the Google Cloud
   project where Custom Search API is enabled and the Programmable Search
   Engine configured for public-web search. Keep the API key server-only; do
   not use a `NEXT_PUBLIC_` name. Redeploy after setting the variables.
5. Apply and verify Supabase migrations in the same project referenced by
   `NEXT_PUBLIC_SUPABASE_URL` before deploying the app. In Supabase Auth URL
   Configuration, set the exact production Site URL and add
   `https://<production-domain>/auth/callback` to Redirect URLs; retain the
   localhost callback for development. Configure Google/GitHub OAuth with
   Supabase's exact provider callback URL shown in the dashboard.
6. Deploy a Vercel Preview, test sign-in and contextual lesson/project AI, then
   deploy to Production. Verify web search at
   `https://techpathai.tech/web-search` and
   `https://techpathai.tech/web-search?q=javascript`. Redeploy after changing
   Vercel environment variables.

Run `npm test`, `npm run lint`, and `npm run build` before deploying. Keep
`.env.local` out of Git. Rotate provider credentials immediately if they are
shared in chat, screenshots, source code, or logs.
