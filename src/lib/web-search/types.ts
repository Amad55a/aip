export const WEB_SEARCH_PAGE_SIZE = 10;
export const WEB_SEARCH_MAX_PAGE = 10;

export type WebSearchResult = {
  title: string;
  url: string;
  displayUrl: string;
  snippet?: string;
};

export type WebSearchResponse = {
  results: WebSearchResult[];
  totalResults?: number;
  page: number;
  hasNextPage: boolean;
};
