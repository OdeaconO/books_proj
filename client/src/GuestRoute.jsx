import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If already logged in, redirect to books
  if (token) {
    return <Navigate to="/books" replace />;
  }

  return children;
};

export default GuestRoute;
