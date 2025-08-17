// Mock paginated response type
export interface TGenericPaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string | null;
  previous?: string | null;
  page_count: number;
}
