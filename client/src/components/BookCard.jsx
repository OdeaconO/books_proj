import { Link, useNavigate } from "react-router-dom";
import { highlightText } from "../utils/highlightText";
import { getCoverUrl } from "../utils/getCoverUrl";
import placeholder from "../assets/cover-placeholder.svg";

const BookCard = ({ book, q, user, isAuthenticated, onDelete, footer }) => {
  const isUserBook = Boolean(book.user_id);
  const navigate = useNavigate();

  return (
    <div
      className={`book ${book.currently_reading ? "reading" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/books/${book.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          navigate(`/books/${book.id}`);
        }
      }}
    >
      <img
        src={getCoverUrl(book)}
        alt={book.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = placeholder;
        }}
      />

      <h2 className="mark">{highlightText(book.title, q)}</h2>

      <p className="meta">
        <strong>Author:</strong> {book.authors}
      </p>

      {book.genre && (
        <p className="meta">
          <strong>Genre:</strong> {book.genre}
        </p>
      )}

      {isUserBook && book.username && (
        <p className="meta">
          <strong>Recommended by:</strong> {book.username}
        </p>
      )}

      {/* ✅ THIS IS THE CORRECT PLACE FOR YOUR NEW BUTTONS */}
      {/* (Visually between the meta info and the admin/delete buttons) */}

      {footer && (
        <div className="book-footer" onClick={(e) => e.stopPropagation()}>
          {footer}
        </div>
      )}

      {/* Admin / Owner actions */}
      {isAuthenticated &&
        (user.role === "admin" || user.id === book.user_id) && (
          <div className="actions">
            <button
              className="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book.id);
              }}
            >
              Delete
            </button>
            <button className="update" onClick={(e) => e.stopPropagation()}>
              <Link
                to={`/update/${book.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                Update
              </Link>
            </button>
          </div>
        )}
    </div>
  );
};

export default BookCard;
