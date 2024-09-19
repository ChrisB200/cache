import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.module.css";
import "../index.css";
import AuthService from "../api/authService";
import CredentialsForm from "../components/CredentialsForm";
import StepIndicator from "../components/StepIndicator";

function SignUp() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeForm, setActiveForm] = useState("SignUpForm");
  const [values, setValues] = useState({
    email: "",
    password: "",
    fguser: "",
    fgpass: "",
    sduser: "",
    sdpass: "",
  });

  const formRefs = {
    initial: useRef(null),
    fiveguys: useRef(null),
    sdworx: useRef(null),
  };

  const navigate = useNavigate();

  const onSubmitSignUp = (e) => {
    e.preventDefault();
    AuthService.is_user(values.email)
      .then(() => {
        setActiveForm("FGPForm");
        setActiveStep(2);
      })
      .catch(() => {
        // Handle error
      });
  };

  const onSubmitFGP = (e) => {
    e.preventDefault();
    setActiveForm("SDForm");
    setActiveStep(3);
  };

  const onSubmitSD = (e) => {
    e.preventDefault();
    AuthService.signup(
      values.email,
      values.password,
      values.fguser,
      values.fgpass,
      values.sduser,
      values.sdpass,
    ).then(() => {
      AuthService.login(values.email, values.password).then(() => {
        navigate("/home");
      });
    });
  };

  const onPrevFGP = (e) => {
    e.preventDefault();
    setActiveForm("SignUpForm");
    setActiveStep(1);
  };

  const onPrevSD = (e) => {
    e.preventDefault();
    setActiveForm("FGPForm");
    setActiveStep(2)
  };

  return (
    <div className="signup-content">
      <StepIndicator activeStep={activeStep} />

      {activeForm === "SignUpForm" && (
        <CredentialsForm
          header="Sign up to Cache"
          values={values}
          setValues={setValues}
          submit={{ onClick: onSubmitSignUp, text: "Continue" }}
          inputs={{
            first: { type: "email", name: "email", placeholder: "Email" },
            second: {
              type: "password",
              name: "password",
              placeholder: "Password",
            },
          }}
          ref={formRefs.initial}
        />
      )}

      {activeForm === "FGPForm" && (
        <CredentialsForm
          header="Five Guys People"
          values={values}
          setValues={setValues}
          submit={{ onClick: onSubmitFGP, text: "Continue" }}
          prev={{ onClick: onPrevFGP, text: "Go back" }}
          inputs={{
            first: {
              type: "username",
              name: "fguser",
              placeholder: "Five Guys Username",
            },
            second: {
              type: "password",
              name: "fgpass",
              placeholder: "Five Guys Password",
            },
          }}
          ref={formRefs.fiveguys}
        />
      )}

      {activeForm === "SDForm" && (
        <CredentialsForm
          header="Sdworx Credentials"
          values={values}
          setValues={setValues}
          submit={{ onClick: onSubmitSD, text: "Continue" }}
          prev={{ onClick: onPrevSD, text: "Go back" }}
          inputs={{
            first: {
              type: "username",
              name: "sduser",
              placeholder: "Sdworx Username",
            },
            second: {
              type: "password",
              name: "sdpass",
              placeholder: "Sdworx Password",
            },
          }}
          ref={formRefs.sdworx}
        />
      )}
    </div>
  );
}
export default SignUp;
