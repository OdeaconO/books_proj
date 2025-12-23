import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/books" replace />;
  }

  return children;
};

export default GuestRoute;
