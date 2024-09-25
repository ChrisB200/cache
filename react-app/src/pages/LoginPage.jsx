import { useState, useRef} from "react";
import { useNavigate } from "react-router-dom"
import AuthService from "../api/authService"
import CredentialsForm from "../components/CredentialsForm";
import "../index.css"
import httpClient from "../utils/httpClient";

function Login() {
  console.log(httpClient.get("http://flask-api:8000"))
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const inputs = {
    first: {
      type: "email",
      name: "email",
      placeholder: "Email"
    },
    second: {
      type: "password",
      name: "password",
      placeholder: "Password"
    }
  }

  const handleSubmit = async () => {
    AuthService.login(values.email, values.password)
      .then(() => {
        navigate("/home")
      })
  }
  
  return (
     <CredentialsForm
      header="Log in to Cache"
      values={values}
      setValues={setValues}
      submit={{onClick: handleSubmit, text: "Log In"}}
      inputs={inputs}
    />
  )
}

export default Login;
