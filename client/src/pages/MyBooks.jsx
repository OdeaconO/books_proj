import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import { useDebouncedValue } from "../utils/useDebouncedValue";
import { useSearchParams } from "react-router-dom";
import PaginationFooter from "../components/PaginationFooter";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);

  const debouncedQ = useDebouncedValue(q);

  useEffect(() => {
    const fetchMyBooks = async () => {
      const res = await api.get(`/my-books?q=${debouncedQ}&page=${page}`);

      setBooks(res.data.books);
      setPagination(res.data.pagination);
    };

    fetchMyBooks();
  }, [debouncedQ, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>My Books</h1>

      {books.length === 0 && (
        <div className="empty-state">
          <h2>No books yet 📘</h2>
          <p>
            {q
              ? "No matching books in your collection."
              : "You haven’t added any books yet."}
          </p>
          <Link to="/add" className="cta-btn">
            ➕ Add your first book
          </Link>
        </div>
      )}

      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && <img src={book.cover} alt="" />}
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <span>{book.price}</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>
              Delete
            </button>
            <button className="update">
              <Link to={`/update/${book.id}`}>Update</Link>
            </button>
          </div>
        ))}
      </div>
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default MyBooks;
