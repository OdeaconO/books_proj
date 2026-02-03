import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "../utils/useDebouncedValue";

export const DEFAULT_LIMIT = 20;

export const useSearchPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const genre = searchParams.get("genre") || "";
  const sort = searchParams.get("sort") || "title";
  const order = searchParams.get("order") || "asc";

  const debouncedQ = useDebouncedValue(q);

  const updateParams = (updates) => {
    const next = {
      q,
      page,
      genre,
      sort,
      order,
      ...updates,
    };

    // Clean empty params
    Object.keys(next).forEach((key) => {
      if (!next[key]) delete next[key];
    });

    setSearchParams(next);
  };

  return {
    q,
    debouncedQ,
    page,
    genre,
    sort,
    order,
    limit: DEFAULT_LIMIT,

    setQuery: (value) =>
      updateParams({
        q: value,
        page: 1,
      }),

    setPage: (value) =>
      updateParams({
        page: value,
      }),

    setGenre: (value) =>
      updateParams({
        genre: value,
        page: 1,
      }),

    setSort: (sortValue, orderValue) =>
      updateParams({
        sort: sortValue,
        order: orderValue,
        page: 1,
      }),
  };
};
