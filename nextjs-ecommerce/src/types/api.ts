export type PaginatedResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};

export type ApiList<T> = T[] | PaginatedResponse<T>;

export const asArray = <T>(data: ApiList<T>): T[] =>
  Array.isArray(data) ? data : data.results ?? [];
