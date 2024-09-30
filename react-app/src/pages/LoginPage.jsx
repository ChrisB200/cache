import { useState, useRef} from "react";
import { useNavigate } from "react-router-dom"
import AuthService from "../api/authService"
import CredentialsForm from "../components/CredentialsForm";
import "../index.css"

function Login() {
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
        navigate("/")
      })
  }
  
  return (
     <CredentialsForm
      header="Log in"
      values={values}
      setValues={setValues}
      submit={{onClick: handleSubmit, text: "Log In"}}
      inputs={inputs}
    />
  )
}

export default Login;
