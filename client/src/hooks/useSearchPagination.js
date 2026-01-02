import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "../utils/useDebouncedValue";

export const DEFAULT_LIMIT = 20;

export const useSearchPagination = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  const debouncedQ = useDebouncedValue(q);

  const setQuery = (newQuery) => {
    setSearchParams({
      q: newQuery,
      page: 1, // reset page on query change
    });
  };

  const setPage = (newPage) => {
    setSearchParams({
      q,
      page: newPage,
    });
  };

  return {
    q,
    page,
    debouncedQ,
    limit: DEFAULT_LIMIT,
    setQuery,
    setPage,
  };
};
