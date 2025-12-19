import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({...prev, [e.target.value]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            console.log(inputs);
            const res = await api.post("/auth/login", inputs);
            localStorage.setItem("token", res.data.token);
            navigate("/");
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
        </div>
    );
};

export default Login;