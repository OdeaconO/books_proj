import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { getCoverUrl } from "../utils/getCoverUrl";
import placeholder from "../assets/cover-placeholder.svg";
import { useBookActions } from "../hooks/useBookActions";

const BookDetail = () => {
  const { id } = useParams();

  const token = localStorage.getItem("token");

  // 🛑 FIX: Use 'id' from params here, not 'book.id' (because book is null initially)
  const actions = useBookActions(id);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentlyReading, setCurrentlyReading] = useState(false);
  const [crLoading, setCrLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
        setError("Book not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    if (!actions.inReadingList) {
      setCurrentlyReading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await api.get(`/reading-list/${id}/status`);
        setCurrentlyReading(res.data.currentlyReading);
      } catch (err) {
        console.error(err);
        setCurrentlyReading(false);
      }
    };

    fetchStatus();
  }, [actions.inReadingList, id]);

  const setAsCurrentlyReading = async () => {
    try {
      setCrLoading(true);
      await api.put(`/reading-list/${id}/current`);
      setCurrentlyReading(true);
    } catch (err) {
      console.error(err);
    } finally {
      setCrLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <main className="page-content">
          <p>Loading…</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <main className="page-content">
          <p>{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page-content">
        <div className="book-detail">
          <div className="card cover-card">
            <img
              src={getCoverUrl(book, "L")}
              alt={book.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
            />
          </div>

          <div className="card info-card">
            <div className="book-info">
              <h1>{book.title}</h1>

              <strong>Author: </strong>
              {book.authors && <p className="authors">{book.authors}</p>}

              <strong>Genre: </strong>
              {book.genre && <p className="genre">{book.genre}</p>}

              {/* 📚 My Books actions */}
              {token && (
                <>
                  {!actions.inMyBooks ? (
                    <button
                      onClick={actions.addToMyBooks}
                      className="action-btn add"
                    >
                      Add to My Books
                    </button>
                  ) : (
                    <button
                      onClick={actions.removeFromMyBooks}
                      className="action-btn remove"
                    >
                      Remove from My Books
                    </button>
                  )}

                  {!actions.inReadingList ? (
                    <button
                      onClick={actions.addToReadingList}
                      className="action-btn add"
                    >
                      Add to Reading List
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={actions.removeFromReadingList}
                        className="action-btn remove"
                      >
                        Remove from Reading List
                      </button>

                      <button
                        onClick={setAsCurrentlyReading}
                        className={`action-btn ${currentlyReading ? "active" : ""}`}
                        disabled={currentlyReading || crLoading}
                      >
                        {currentlyReading
                          ? "✔ Currently Reading"
                          : "Mark as Currently Reading"}
                      </button>
                    </>
                  )}
                </>
              )}

              <p className="description">{book.desc}</p>

              <p className="meta">Added by {book.username ?? "Open Library"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookDetail;
