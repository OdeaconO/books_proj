import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="form">
      <h1>Register</h1>

      <input
        type="text"
        name="username"
        placeholder="Enter username"
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Enter email"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
        onChange={handleChange}
      />

      <button className="loginButton" onClick={handleSubmit}>
        Register
      </button>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
