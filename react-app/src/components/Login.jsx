import React from 'react'
import { useState } from 'react';

export function Login() {
  const [allValues, setAllValues] = useState({
    email: "",
    password: ""
  });

  const changeHandler = e => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value })
  }

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allValues),
    })
    const token = await response.json()
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 30 * 60 * 1000);
    document.cookie = `access_token=${token}; expires=${expirationDate.toUTCString()}; path=/`;
  }
  return (
    <>
      <img alt='Logo Position' src="#" />
      <h1>
        Create an account
      </h1>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <div classname="form-row">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            onChange={changeHandler}
          />
        </div>
        <div classname="form-row">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            onChange={changeHandler}
          />
        </div>
        <button className="sign-up-btn">Sign up</button>
      </form>
    </>
  )
}

export default Login;