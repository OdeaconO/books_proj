import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8800",
});

export const addToMyBooks = (bookId) => api.post("/user-books", { bookId });

export const removeFromMyBooks = (bookId) =>
  api.delete(`/user-books/${bookId}`);

export const addToReadingList = (bookId) =>
  api.post("/reading-list", { bookId });

export const removeFromReadingList = (bookId) =>
  api.delete(`/reading-list/${bookId}`);

export const isInMyBooks = (bookId) => api.get(`/user-books/${bookId}`);

export const isInReadingList = (bookId) => api.get(`/reading-list/${bookId}`);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
