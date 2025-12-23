import{
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired } from "./utils/isTokenExpired";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import Account from "./pages/Account";
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.css";

function App() {

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        <Route path="/account" element={<ProtectedRoute><Account/></ProtectedRoute>}/>
        <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><Add/></ProtectedRoute>}/>
        <Route path="/update/:id" element={<ProtectedRoute><Update/></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
