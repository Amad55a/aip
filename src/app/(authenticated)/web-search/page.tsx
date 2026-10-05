import WebSearch from "@/components/search/WebSearch";

type WebSearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WebSearchPage({ searchParams }: WebSearchPageProps) {
  const params = await searchParams;
  const queryValue = params.q;
  const pageValue = params.page;
  const query = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? "";
  const page = Array.isArray(pageValue) ? pageValue[0] ?? "1" : pageValue ?? "1";

  return <WebSearch initialQuery={query} initialPage={page} />;
}
