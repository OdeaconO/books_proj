import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const MyBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await api.get("/my-books");
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMyBooks();
  }, []);

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

      {books.length === 0 && <p>You haven’t added any books yet.</p>}

      <div className="books">
        {books.map((book) => (
          <div className="book" key={book.id}>
            {book.cover && <img src={book.cover} alt="" />}
            <h2>{book.title}</h2>
            <p>{book.desc}</p>
            <span>{book.price}</span>
            <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
            <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooks;
