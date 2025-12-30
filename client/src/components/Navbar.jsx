import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get("q") || "";
  
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);
  
  const handleSearch = (e) => {
    setSearchParams({
      q: e.target.value,
      page: 1, 
    });
  };

  const handleLogout = () => {
    logout();
  };

    return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <Link to="/books" className="logo">
          📚 Paper Town
        </Link>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />

        <button
          className="hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* MENU */}
      <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
        <Link to="/books">All Books</Link>

        {isAuthenticated ? (
          <>
            <Link to="/my-books">My Books</Link>
            <Link to="/add">Add Book</Link>
            <Link to="/account">Account</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
