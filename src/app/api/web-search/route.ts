import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  WEB_SEARCH_MAX_PAGE,
  WEB_SEARCH_PAGE_SIZE,
  type WebSearchResult,
} from "@/lib/web-search/types";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getGoogleErrorReasons(payload: unknown): string[] {
  if (!isRecord(payload) || !isRecord(payload.error)) return [];
  const errors = payload.error.errors;
  if (!Array.isArray(errors)) return [];
  return errors.flatMap((error) =>
    isRecord(error) && typeof error.reason === "string" ? [error.reason] : []
  );
}

function getResultUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
      ? url
      : null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q") ?? "";
  const trimmedQuery = query.trim();
  const pageValue = searchParams.get("page") ?? "1";

  if (query.length > 200 || !trimmedQuery) {
    return NextResponse.json({ error: "invalid_query" }, { status: 400 });
  }

  if (!/^[1-9]\d*$/.test(pageValue)) {
    return NextResponse.json({ error: "invalid_page" }, { status: 400 });
  }

  const page = Number(pageValue);
  if (!Number.isSafeInteger(page) || page > WEB_SEARCH_MAX_PAGE) {
    return NextResponse.json({ error: "invalid_page" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;
  if (!apiKey || !engineId) {
    console.error("Web search is missing server configuration.");
    return NextResponse.json({ error: "search_unavailable" }, { status: 503 });
  }

  const googleUrl = new URL("https://www.googleapis.com/customsearch/v1");
  googleUrl.searchParams.set("key", apiKey);
  googleUrl.searchParams.set("cx", engineId);
  googleUrl.searchParams.set("q", trimmedQuery);
  googleUrl.searchParams.set("start", String((page - 1) * WEB_SEARCH_PAGE_SIZE + 1));
  googleUrl.searchParams.set("num", String(WEB_SEARCH_PAGE_SIZE));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(googleUrl, {
      signal: controller.signal,
      cache: "no-store",
    });
    const payload: unknown = await response.json();

    if (!response.ok) {
      const reasons = getGoogleErrorReasons(payload);
      if (
        response.status === 429 ||
        reasons.some((reason) =>
          ["dailyLimitExceeded", "userRateLimitExceeded", "rateLimitExceeded", "quotaExceeded"].includes(reason)
        )
      ) {
        return NextResponse.json({ error: "search_busy" }, { status: 429 });
      }

      console.error("Google web search request failed.", { status: response.status });
      return NextResponse.json({ error: "search_unavailable" }, { status: 502 });
    }

    if (!isRecord(payload)) {
      console.error("Google web search returned an invalid response.");
      return NextResponse.json({ error: "search_unavailable" }, { status: 502 });
    }

    const rawResults = payload.items;
    if (rawResults !== undefined && !Array.isArray(rawResults)) {
      console.error("Google web search returned malformed result items.");
      return NextResponse.json({ error: "search_unavailable" }, { status: 502 });
    }
    const googleResults: unknown[] = Array.isArray(rawResults) ? rawResults : [];
    const results: WebSearchResult[] = googleResults.flatMap((item) => {
      if (!isRecord(item) || typeof item.title !== "string") return [];
      const url = getResultUrl(item.link);
      if (!url) return [];
      return [{
        title: item.title,
        url: url.toString(),
        displayUrl: url.hostname,
        ...(typeof item.snippet === "string" ? { snippet: item.snippet } : {}),
      }];
    });

    const searchInformation = isRecord(payload.searchInformation)
      ? payload.searchInformation
      : undefined;
    const totalValue = searchInformation?.totalResults;
    const parsedTotal = typeof totalValue === "string" ? Number(totalValue) : Number.NaN;
    const totalResults = Number.isSafeInteger(parsedTotal) ? parsedTotal : undefined;
    const queries = isRecord(payload.queries) ? payload.queries : undefined;
    const nextPages = queries?.nextPage;
    const nextPage = Array.isArray(nextPages) ? nextPages[0] : undefined;
    const nextStart =
      isRecord(nextPage) ? nextPage.startIndex : undefined;
    const hasNextPage =
      page < WEB_SEARCH_MAX_PAGE &&
      typeof nextStart === "number" &&
      Number.isSafeInteger(nextStart) &&
      nextStart > 0;

    return NextResponse.json({
      results,
      ...(totalResults === undefined ? {} : { totalResults }),
      page,
      hasNextPage,
    });
  } catch (error) {
    if (controller.signal.aborted) {
      return NextResponse.json({ error: "search_timeout" }, { status: 504 });
    }
    console.error("Google web search could not be reached.", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ error: "search_unavailable" }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
