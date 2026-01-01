import { useSearchParams } from "react-router-dom";

const PaginationFooter = ({ pagination }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  return (
    <footer className="pagination">
      <button
        disabled={pagination.currentPage === 1}
        onClick={() =>
          setSearchParams({
            q,
            page: page - 1,
          })
        }
      >
        Previous
      </button>

      <span>
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>

      <button
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() =>
          setSearchParams({
            q,
            page: page + 1,
          })
        }
      >
        Next
      </button>
    </footer>
  );
};

export default PaginationFooter;
