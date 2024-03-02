import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import AuthService from '../AuthService';
import "./Register.css"

function Register() {
  const navigate = useNavigate();
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

    AuthService.register(values.username, values.email, values.password)
      .then(() => {
        AuthService.login(values.email, values.password)
          .then(() => {
            navigate("/overview");
          })
          .catch(error => {
            console.error('Login error:', error);
          });
      })
      .catch(error => {
        console.error('Signup error:', error);
      });
  };

  return (<>
    <img alt='Logo Position' src={logo} />
    <div className='signup-content'>
      <h2>Sign up to Cache</h2>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <input
          type="text"
          name="username"
          id="username"
          placeholder='name'
          value={values.username}
          onChange={handleChange}
        />


        <input
          placeholder='email'
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
          placeholder='password'
        />

        <button className="sign-up-btn" type="submit">
          Sign up
        </button>
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
