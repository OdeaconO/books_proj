import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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
        {isAuthenticated ? (
          <>
            <Link to="/books">Home</Link>
            <Link to="/my-books">My Books</Link>
            <Link to="/add">Add Book</Link>
            <Link to="/account">Account</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
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
