import { useSearchPagination } from "../hooks/useSearchPagination";

const PAGE_WINDOW = 5;

const PaginationFooter = ({ pagination }) => {
  const { page, limit, setPage } = useSearchPagination();

  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalBooks } = pagination;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalBooks);

  const half = Math.floor(PAGE_WINDOW / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);

  if (endPage - startPage < PAGE_WINDOW - 1) {
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <footer className="pagination">
      <span className="pagination-info">
        Showing {start}–{end} of {totalBooks}
      </span>

      <div className="pagination-controls">
        <button disabled={currentPage === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={p === currentPage ? "active" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </footer>
  );
};

export default PaginationFooter;
