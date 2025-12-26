import { useEffect, useState } from 'react'
import { api } from "../api";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";


const Books = () => {

    const [books,setBooks] = useState([]);
    const { user, isAuthenticated } = useAuth();

    useEffect(()=>{
        const fetchAllBooks = async ()=>{
            try{
                const res = await api.get("http://localhost:8800/books");
                setBooks(res.data);
            } catch(err){
                console.log(err);
            }
        }
        fetchAllBooks();
    },[])

    const handleDelete = async (id) => {
      try{
        await api.delete("http://localhost:8800/books/"+id);
        window.location.reload();
      } catch(err){
        console.log(err);
      }
    }

  return (
    <div>
      <div className="books">
        {books.map(book=>(
          <div className="book" key={book.id}>
            {book.cover && <img src={book.cover} alt=""/>}
            <h2>{book.title}</h2>
            <p><strong>Description:</strong> {book.desc}</p>
            <p><strong>Recommended by:</strong> {book.username}</p>
            <span><strong>Price:</strong> {book.price}</span>
            {isAuthenticated && (user.role === "admin" || user.id === book.user_id) && (
  <>
    <button className="delete" onClick={() => handleDelete(book.id)}>
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
    </div>
  )
}

export default Books
