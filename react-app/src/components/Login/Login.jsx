import { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom"
import AuthService from "../../api/authService"

import "../../index.css"
import "./Login.css"

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const form = useRef(null);

  const handleChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    AuthService.login(values.email, values.password)
      .then(() => {
        navigate("/home")
      })
      .catch(() => {
        form.current.classList.add("error-input");
      })
  }
  
  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit} ref={form}>
        <h1>Log in to Cache</h1>
        <input
          type="email"
          name="email"
          id="email"
          value={values.email}
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          value={values.password}
          placeholder="Password"
          onChange={handleChange}
        />
        <div>
          <button type="submit">Log In</button>
        </div>
      </form>
    </div>
  )
}

export default Login;
