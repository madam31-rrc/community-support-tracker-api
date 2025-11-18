export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function paginate<T>(
  items: T[],
  page = 1,
  limit = 10
): PaginationResult<T> {
  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);
  return { items: paginated, total, page, limit };
}
