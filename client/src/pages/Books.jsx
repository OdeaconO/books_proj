import { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { api } from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationFooter from "../components/PaginationFooter";
import { useSearchPagination } from "../hooks/useSearchPagination";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { q, page, debouncedQ, genre, sort, order, setPage } =
    useSearchPagination();

  useEffect(() => {
    const fetchAllBooks = async () => {
      const res = await api.get("/books", {
        params: {
          q: debouncedQ,
          page,
          genre,
          sort,
          order,
        },
      });

      console.log("DEBUG: API Data", res.data.books);

      setBooks(res.data.books);
      setPagination(res.data.pagination);
    };

    fetchAllBooks();
  }, [debouncedQ, page, genre, sort, order]);

  const handleDelete = async (id) => {
    const shouldRefetch = pagination && pagination.totalBooks % 20 === 1;

    try {
      await api.delete(`/books/${id}`);

      setBooks((prev) => {
        const updated = prev.filter((b) => b.id !== id);

        if (updated.length === 0 && page > 1) {
          setPage(page - 1); // 👈 move back safely
        }

        return updated;
      });

      setPagination((prev) => {
        if (!prev) return prev;

        const newTotalBooks = prev.totalBooks - 1;
        const newTotalPages = Math.max(1, Math.ceil(newTotalBooks / 20));

        return {
          ...prev,
          totalBooks: newTotalBooks,
          totalPages: newTotalPages,
        };
      });

      if (shouldRefetch) {
        const res = await api.get(`/books?q=${debouncedQ}&page=${page}`);
        setBooks(res.data.books);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page">
      <main className="page-content">
        {books.length === 0 ? (
          <div className="empty-state">
            <h2>No books found 📚</h2>
            <p>
              {q
                ? "Try a different search keyword."
                : "Be the first one to add a book to the collection."}
            </p>
            {isAuthenticated ? (
              <Link to="/add" className="cta-btn">
                Be the first to add this book!
              </Link>
            ) : (
              <Link to="/login" className="cta-btn">
                Login to add books
              </Link>
            )}
          </div>
        ) : (
          <div className="books">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                q={q}
                user={user}
                isAuthenticated={isAuthenticated}
                onDelete={handleDelete} // Pass the delete function down
              />
            ))}
          </div>
        )}
      </main>
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default Books;
