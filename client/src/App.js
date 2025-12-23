import{
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./style.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><Add/></ProtectedRoute>}/>
        <Route path="/update/:id" element={<ProtectedRoute><Update/></ProtectedRoute>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
