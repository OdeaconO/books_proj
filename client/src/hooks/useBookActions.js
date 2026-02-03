import { useEffect, useState } from "react";
import {
  addToMyBooks as apiAddToMyBooks,
  removeFromMyBooks as apiRemoveFromMyBooks,
  addToReadingList as apiAddToReadingList,
  removeFromReadingList as apiRemoveFromReadingList,
  isInMyBooks,
  isInReadingList,
} from "../api";

export const useBookActions = (bookId) => {
  const token = localStorage.getItem("token");

  const [inMyBooks, setInMyBooks] = useState(false);
  const [inReadingList, setInReadingList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔑 CRITICAL GUARD
    if (!token || !bookId) {
      setLoading(false);
      setInMyBooks(false);
      setInReadingList(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const [myBooksRes, readingRes] = await Promise.all([
          isInMyBooks(bookId),
          isInReadingList(bookId),
        ]);

        setInMyBooks(myBooksRes.data);
        setInReadingList(readingRes.data);
      } catch (err) {
        console.error("Book status check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [bookId, token]);

  return {
    loading,
    inMyBooks,
    inReadingList,

    addToMyBooks: async () => {
      if (!token) return;
      await apiAddToMyBooks(bookId);
      setInMyBooks(true);
    },

    removeFromMyBooks: async () => {
      if (!token) return;
      await apiRemoveFromMyBooks(bookId);
      setInMyBooks(false);
    },

    addToReadingList: async () => {
      if (!token) return;
      await apiAddToReadingList(bookId);
      setInReadingList(true);
    },

    removeFromReadingList: async () => {
      if (!token) return;
      await apiRemoveFromReadingList(bookId);
      setInReadingList(false);
    },
  };
};
