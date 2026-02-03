import { api } from "../api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Add = () => {
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

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("authors", book.authors);
      formData.append("genre", book.genre);
      formData.append("desc", book.desc);

      if (file) {
        formData.append("cover", file);
      }

      await api.post("/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/my-books");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Add new book</h1>
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
        Add
      </button>
    </form>
  );
};

export default Add;
