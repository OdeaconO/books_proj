import { api } from "../api";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    authors: "",
    genre: "",
    desc: "",
  });

  const GENRES = [
    "fantasy",
    "sci-fi",
    "romance",
    "mystery",
    "horror",
    "thriller",
    "true crime",
  ];

  const [file, setFile] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const bookId = location.pathname.split("/")[2];

  console.log(location.pathname.split("/")[2]);

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${bookId}`);
        setBook({
          title: res.data.title,
          authors: res.data.authors,
          genre: res.data.genre,
          desc: res.data.desc,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("authors", book.authors);
      formData.append("genre", book.genre);
      formData.append("desc", book.desc);

      // Only append cover if user selected a new one
      if (file) {
        formData.append("cover", file);
      }

      await api.put(`/books/${bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/my-books");
    } catch (err) {
      console.error(err);
    }
  };

  console.log(book);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Update book</h1>
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={book.title}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder="Authors"
        name="authors"
        value={book.authors}
        onChange={handleChange}
      />

      <label>
        Genre:
        <select
          name="genre"
          value={book.genre}
          onChange={handleChange}
          required
        >
          <option value="">Select a genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <input
        type="text"
        placeholder="Description"
        name="desc"
        value={book.desc}
        onChange={handleChange}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button type="submit" className="formButton">
        Update
      </button>
    </form>
  );
};

export default Update;
