import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            console.log(inputs);
            const res = await api.post("/auth/login", inputs);
            login(res.data.token);
            navigate("/books");
        } catch (err){
            console.log(err.response?.data || err.message);
        }
    };

    return (
        <div className="form">
            <h1>Login</h1>
            
            <input 
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange} />

            <input 
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange} />

            <button className="loginButton" onClick={handleSubmit}>Login</button>
            
            <p style={{ marginTop: "10px" }}>
                Don't have an account?{" "}
                <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;