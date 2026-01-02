import { useSearchParams } from "react-router-dom";

const PAGE_WINDOW = 5; // how many page buttons to show

const PaginationFooter = ({ pagination }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const q = searchParams.get("q") || "";
  const currentPage = pagination.currentPage;
  const totalPages = pagination.totalPages;
  const totalBooks = pagination.totalBooks;

  const limit = 20;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalBooks);

  // Calculate page window
  const half = Math.floor(PAGE_WINDOW / 2);
  let startPage = Math.max(1, currentPage - half);
  let endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);

  if (endPage - startPage < PAGE_WINDOW - 1) {
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const goToPage = (page) => {
    setSearchParams({
      q,
      page,
    });
  };

  return (
    <footer className="pagination">
      {/* Range info */}
      <span className="pagination-info">
        Showing {start}–{end} of {totalBooks}
      </span>

      {/* Controls */}
      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={p === currentPage ? "active" : ""}
            onClick={() => goToPage(p)}
          >
            {p}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </footer>
  );
};

export default PaginationFooter;
