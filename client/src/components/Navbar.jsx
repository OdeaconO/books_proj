import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q") || "";
  
  const handleSearch = (e) => {
  setSearchParams({ q: e.target.value });
};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/books" className="logo">
          📚 Paper Town
        </Link>
      </div>

      <div className="nav-right">
        <input
        type="text"
        placeholder="Search books..."
        value={searchQuery}
        onChange={handleSearch}
        className="search-input"
        />

        <Link to="/books">All Books</Link>
        {isAuthenticated ? (
            <>
                <Link to="/my-books">My Books</Link>
                <Link to="/add">Add Book</Link>
                <Link to="/account">Account</Link><button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
            ) : (
            <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </>
        )}
        </div>
    </nav>
  );
};

export default Navbar;
