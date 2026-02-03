import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import PaginationFooter from "../components/PaginationFooter";
import { useSearchPagination } from "../hooks/useSearchPagination";

const ReadingList = () => {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const { q, debouncedQ, page, genre, sort, order, setPage } =
    useSearchPagination();

  useEffect(() => {
    const fetchReadingList = async () => {
      try {
        const res = await api.get("/reading-list", {
          params: {
            q: debouncedQ,
            page,
            genre,
            sort,
            order,
          },
        });

        setBooks(res.data.books);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
        setBooks([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, [debouncedQ, page, genre, sort, order]);

  const setCurrentlyReading = async (bookId) => {
    try {
      await api.put(`/reading-list/${bookId}/current`);

      // Update UI optimistically
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== bookId) {
            return { ...b, currently_reading: 0 };
          }

          // toggle the clicked book
          return {
            ...b,
            currently_reading: b.currently_reading ? 0 : 1,
          };
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromReadingList = async (bookId) => {
    try {
      await api.delete(`/reading-list/${bookId}`);
      setBooks((prev) => {
        const updated = prev.filter((b) => b.id !== bookId);

        if (updated.length === 0 && page > 1) {
          setPage(page - 1);
        }

        return updated;
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <main className="page-content">
          <p>Loading reading list…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page-content">
        <h1>Reading List</h1>

        {books.length === 0 ? (
          <div className="empty-state">
            <h2>No books in your reading list 📖</h2>
            <p>Add books from the catalog to start reading.</p>
          </div>
        ) : (
          <div className="books">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                user={user}
                isAuthenticated={isAuthenticated}
                q={q}
                footer={
                  <div className="reading-actions">
                    <button
                      className={`action-btn ${
                        book.currently_reading ? "active" : ""
                      }`}
                      onClick={() => setCurrentlyReading(book.id)}
                    >
                      {book.currently_reading
                        ? "Unset Currently Reading"
                        : "Mark as Currently Reading"}
                    </button>

                    <button
                      className="action-btn remove"
                      onClick={() => removeFromReadingList(book.id)}
                    >
                      Remove from Reading List
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </main>
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default ReadingList;
