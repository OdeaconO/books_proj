import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaginationFooter from "../components/PaginationFooter";
import { highlightText } from "../utils/highlightText";
import { useSearchPagination } from "../hooks/useSearchPagination";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const { q, page, debouncedQ } = useSearchPagination();

  useEffect(() => {
    const fetchAllBooks = async () => {
      const res = await api.get(`/books?q=${debouncedQ}&page=${page}`);

      setBooks(res.data.books);
      setPagination(res.data.pagination);
    };

    fetchAllBooks();
  }, [debouncedQ, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete("http://localhost:8800/books/" + id);
      window.location.reload();
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
              <div className="book" key={book.id}>
                {book.cover && <img src={book.cover} alt="" />}
                <h2 className="mark">{highlightText(book.title, q)}</h2>
                <p>
                  <strong>Description:</strong> {book.desc}
                </p>
                <p>
                  <strong>Recommended by:</strong> {book.username}
                </p>
                <span>
                  <strong>Price:</strong> {book.price}
                </span>

                {isAuthenticated &&
                  (user.role === "admin" || user.id === book.user_id) && (
                    <>
                      <button
                        className="delete"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                      <button className="update">
                        <Link to={`/update/${book.id}`}>Update</Link>
                      </button>
                    </>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default Books;
