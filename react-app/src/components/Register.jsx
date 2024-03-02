import React, { useState, useEffect } from 'react';
import '../Register.css'
import '../index.css'
import logo from '../assets/logo.png'

export function Register() {
  const [values, setValues] = useState({ username: "", email: "", password: "" });

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
    else {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),


      });
      const result = await response.json();
      console.log(result);
    }
  }
  return (
    <>
      <img alt='Logo Position' src={logo} />
      <div className='content'>

        <h2>Sign up to Cache</h2>
        <form onSubmit={handleSubmit} className="sign-up-form">
          <div className="form-row">
            <input
              type="text"
              name="username"
              id="username"
              placeholder='name'
              value={values.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              placeholder='email'
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <input
              type="password"
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
              placeholder='password'
            />
          </div>
          <button className="sign-up-btn" type="submit">
            Sign up
          </button>

        </form>
        <a href="#">
          Reset password
        </a>
        <p>Already have an account? <a href='#'>log in</a></p>


      </div>
    </>
  );
};



export default Register;
