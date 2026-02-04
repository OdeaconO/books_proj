import { useEffect, useState } from "react";
import { api } from "../api";

export const useBookActions = (bookId) => {
  // NOTE: using localStorage token because AuthContext
  // is not hydrated on initial load
  const token = localStorage.getItem("token");

  const [inMyBooks, setInMyBooks] = useState(false);
  const [inReadingList, setInReadingList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !bookId) {
      setLoading(false);
      setInMyBooks(false);
      setInReadingList(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const res = await api.get(`/book-actions/${bookId}`);
        setInMyBooks(res.data.inMyBooks);
        setInReadingList(res.data.inReadingList);
      } catch (err) {
        console.error("Failed to fetch book actions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [bookId, token]);

  return {
    loading,
    inMyBooks,
    inReadingList,

    addToMyBooks: async () => {
      if (!token) return;
      await api.post("/user-books", { bookId });
      setInMyBooks(true);
    },

    removeFromMyBooks: async () => {
      if (!token) return;
      await api.delete(`/user-books/${bookId}`);
      setInMyBooks(false);
    },

    addToReadingList: async () => {
      if (!token) return;
      await api.post("/reading-list", { bookId });
      setInReadingList(true);
    },

    removeFromReadingList: async () => {
      if (!token) return;
      await api.delete(`/reading-list/${bookId}`);
      setInReadingList(false);
    },
  };
};
