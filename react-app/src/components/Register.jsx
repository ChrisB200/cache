import React, { useState, useEffect } from 'react';

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

      <img alt='Logo Position' src="#" />
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <div className="form-row">
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="username"
            id="username"
            value={values.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            value={values.password}
            onChange={handleChange}
          />
        </div>
        <button className="sign-up-btn" type="submit">
          Sign up
        </button>
      </form>
    </>
  );
};



export default Register;
