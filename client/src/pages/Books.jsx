import { useEffect, useState } from 'react'
import { api } from "../api";
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const Books = () => {

    const [books,setBooks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const { user, isAuthenticated } = useAuth();

    const [searchParams, setSearchParams] = useSearchParams();
    
    useEffect(() => {
      const fetchAllBooks = async () => {
        try {
          const q = searchParams.get("q") || "";
          const page = searchParams.get("page") || 1;
          
          const res = await api.get(
            `/books?q=${q}&sort=az&page=${page}`
          );
          
          setBooks(res.data.books);
          setPagination(res.data.pagination);
        } catch (err) {
          console.log(err);
        }
      };
      fetchAllBooks();
    }, [searchParams]);


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
              <button className="delete" onClick={() => handleDelete(book.id)}>Delete</button>
              <button className="update"><Link to={`/update/${book.id}`}>Update</Link></button>
              </>
            )}
            </div>
      ))}
      </div>
      {pagination && (
        <div className="pagination">
          <button
          disabled={pagination.currentPage === 1}
          onClick={() =>setSearchParams({
            q: searchParams.get("q") || "",
            page: pagination.currentPage - 1,
          })
        }>Previous</button>
        
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button
        disabled={pagination.currentPage === pagination.totalPages}
        onClick={() =>
          setSearchParams({
            q: searchParams.get("q") || "",
            page: pagination.currentPage + 1,
          })
        }>Next</button>
        </div>
      )}
    </div>
  )
}

export default Books
