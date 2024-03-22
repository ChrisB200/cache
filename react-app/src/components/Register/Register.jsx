import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import AuthService from '../AuthService';
import { FaSpinner } from 'react-icons/fa'; // Import spinner component
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", email: "", password: "" });
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

    AuthService.register(values.username, values.email, values.password)
      .then(() => {
        AuthService.login(values.email, values.password)
          .then(() => {
            navigate("/overview");
          })
          .catch(error => {
            setError("Login failed. Please try again."); // Set login error message
            setLoading(false); // Hide loading indicator
          });
      })
      .catch(error => {
        setError("Signup failed. Please try again."); // Set signup error message
        setLoading(false); // Hide loading indicator
      });
  };

  return (
    <>
      <div className='logo-position'>
        <img alt='Logo Position' src={logo} />
      </div>
      <div className='signup-content'>
        <h2>Sign up to Cache</h2>
        <form onSubmit={handleSubmit} className="sign-up-form">
          <input
            type="text"
            name="username"
            id="username"
            placeholder='Name'
            value={values.username}
            onChange={handleChange}
          />

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

          <button className="sign-up-btn" type="submit" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : "Sign up"} {/* Replace text with spinner */}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <a className="reset-password" href="#">
          Reset password
        </a>
        <p>Already have an account? <Link to={"/login"}>log in</Link></p>
      </div>
    </>
  );
}

export default Register;
