import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import AuthService from '../AuthService';
import "./Login.css"

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const isValidEmail = /\S+@\S+\.\S+/.test(values.email);
    if (!isValidEmail) {
      console.error('Invalid email address');
      return;
    }

    AuthService.login(values.email, values.password)
      .then(() => {
        navigate("/");
      })
      .catch(error => {
        console.error('Login error:', error);
      });

  };

  return (
    <>
      <img alt='Logo Position' src={logo} />
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

          <button className="login-btn" type="submit">
            Log in
          </button>
        </form>
        <Link href="#">
          Reset password
        </Link>
        <p>Don't have an account? <Link to={"/register"}>create one</Link></p>
      </div>
    </>
  );
}

export default Login;
