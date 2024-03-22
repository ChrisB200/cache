import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import AuthService from '../AuthService';
import { FaSpinner } from 'react-icons/fa'; // Import spinner component
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setLoading(true); // Show loading indicator

    // Validation
    const isValidEmail = /\S+@\S+\.\S+/.test(values.email);
    if (!isValidEmail) {
      setError("Invalid Email Address");
      setLoading(false); // Hide loading indicator
      return;
    }

    AuthService.login(values.email, values.password)
      .then(() => {
        navigate("/overview");
      })
      .catch(error => {
        setError("Invalid Credentials");
        setLoading(false); // Hide loading indicator
      });
  };

  return (
    <>
      <div className="logo-position">
        <img alt='Logo Position' src={logo} />
      </div>
      <div className='login-content'>
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            placeholder='Email'
            type="email"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
            placeholder='Password'
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : "Log in"} {/* Replace text with spinner */}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <Link href="#">
          Reset password
        </Link>
        <p className='redirect-signup'>Don't have an account? <Link to={"/register"}>create one</Link></p>
      </div>
    </>
  );
}

export default Login;
