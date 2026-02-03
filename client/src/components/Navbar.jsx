import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import { useSearchPagination } from "../hooks/useSearchPagination";
import filterIcon from "../assets/filter-icon.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // STEP 1: Local state for the filter dropdown
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null); // To close dropdown when clicking outside

  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  // Get current params for active state checking
  const currentGenre = searchParams.get("genre");
  const currentSort = searchParams.get("sort") || "title";
  const currentOrder = searchParams.get("order") || "asc";
  const searchQuery = searchParams.get("q") || "";

  const isBooksPage = location.pathname === "/books";
  const isMyBooksPage = location.pathname === "/my-books";

  const searchPlaceholder = isMyBooksPage
    ? "Search your books..."
    : isBooksPage
      ? "Search all books..."
      : "Search books";

  const { setGenre, setSort } = useSearchPagination();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await api.get("/genres");
        setGenres(res.data);
      } catch (err) {
        console.error("Failed to load genres", err);
      }
    };

    fetchGenres();
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setFilterOpen(false);
  }, [location.pathname]);

  // Optional: Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("q", value);
      next.set("page", "1");
      return next;
    });
  };

  const handleLogout = () => {
    logout();
  };

  // STEP 4: Clear all filters helper
  const clearAllFilters = () => {
    setSearchParams({});
    setFilterOpen(false);
  };

  // Helper to determine human-readable sort label for the chip
  const getSortLabel = () => {
    if (currentSort === "created_at" && currentOrder === "desc")
      return "Newest";
    if (currentSort === "created_at" && currentOrder === "asc") return "Oldest";
    if (currentSort === "title" && currentOrder === "desc") return "Z-A";
    return "A-Z"; // Default
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
        <div className="search-and-filter-container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (location.pathname !== "/books") {
                navigate(`/books?q=${searchQuery}&page=1`);
              }
            }}
            className="search-form"
          >
            {/* STEP 1 & 2: Replaced <select> with Button + Dropdown */}
            <div className="filter-wrapper" ref={filterRef}>
              <button
                type="button"
                className={`filter-btn ${filterOpen ? "active" : ""}`}
                onClick={() => setFilterOpen((prev) => !prev)}
                title="Filter & Sort"
                aria-expanded={filterOpen}
              >
                <img src={filterIcon} alt="Filter" className="filter-icon" />
              </button>

              {filterOpen && (
                <div className="filter-dropdown">
                  <div className="dropdown-section">
                    <h4>Sort By</h4>
                    <button
                      type="button"
                      className={
                        currentSort === "created_at" && currentOrder === "desc"
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        setSort("created_at", "desc");
                        setFilterOpen(false);
                      }}
                    >
                      Newest added
                    </button>
                    <button
                      type="button"
                      className={
                        currentSort === "created_at" && currentOrder === "asc"
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        setSort("created_at", "asc");
                        setFilterOpen(false);
                      }}
                    >
                      Oldest added
                    </button>
                    <button
                      type="button"
                      className={
                        currentSort === "title" && currentOrder === "asc"
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        setSort("title", "asc");
                        setFilterOpen(false);
                      }}
                    >
                      A–Z
                    </button>
                    <button
                      type="button"
                      className={
                        currentSort === "title" && currentOrder === "desc"
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        setSort("title", "desc");
                        setFilterOpen(false);
                      }}
                    >
                      Z–A
                    </button>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-section">
                    <h4>Genre</h4>
                    <button
                      type="button"
                      className={!currentGenre ? "active" : ""}
                      onClick={() => {
                        setGenre("");
                        setFilterOpen(false);
                      }}
                    >
                      All Genres
                    </button>
                    {genres.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className={currentGenre === g ? "active" : ""}
                        onClick={() => {
                          setGenre(g);
                          setFilterOpen(false);
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="dropdown-divider"></div>

                  <button
                    type="button"
                    className="clear-all-btn"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </form>

          {/* STEP 3: Active Filter Chips */}
          {/* We only show this container if there is an active genre OR a non-default sort */}
          {(currentGenre ||
            currentSort !== "title" ||
            currentOrder !== "asc") && (
            <div className="active-filters">
              {currentGenre && (
                <span className="filter-chip">
                  Genre: {currentGenre}
                  <button onClick={() => setGenre("")} title="Remove genre">
                    ✕
                  </button>
                </span>
              )}

              {/* Show sort chip if it is NOT the default (A-Z) */}
              {(currentSort !== "title" || currentOrder !== "asc") && (
                <span className="filter-chip">
                  Sort: {getSortLabel()}
                  <button
                    onClick={() => setSort("title", "asc")}
                    title="Reset sort"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button className="clear-chip" onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>

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
            <NavLink to="/my-books">My Books</NavLink>
            <NavLink to="/reading-list">Reading List</NavLink>
            <NavLink to="/add">Add Book</NavLink>
            <NavLink to="/account">Account</NavLink>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
