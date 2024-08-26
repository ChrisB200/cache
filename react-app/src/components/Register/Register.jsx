import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import "../../index.css";
import AuthService from "../../utilities/authService";

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    fguser: "",
    fgpass: "",
    sduser: "",
    sdpass: "",
  });

  const forms = {
    initial: useRef(null),
    fiveguys: useRef(null),
    sdworkx: useRef(null),
  };

  const stepOne = useRef(null);
  const stepTwo = useRef(null);
  const stepThree = useRef(null);

  const lineOne = useRef(null);
  const lineTwo = useRef(null);

  const nextForm = (form) => {
    const emailInput = form.querySelector('input[name="email"]');

    if (form === forms.initial.current) {
      AuthService.is_user(values.email)
        .then(() => {
          form.classList.remove("show", "right", "left");
          forms.fiveguys.current.classList.add("show", "right");
          stepTwo.current.classList.add("active");
          emailInput.classList.remove("error-input");
        })
        .catch(() => {
          emailInput.classList.add("error-input");
        });
    } else if (form === forms.fiveguys.current) {
      form.classList.remove("show", "right", "left");
      forms.sdworkx.current.classList.add("show", "right");
      lineTwo.current.classList.add("active");
      stepThree.current.classList.add("active");
    } else if (form === forms.sdworkx.current) {
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
    }
  };

  const handleChange = async (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handlePrev = async (form) => {
    if (form == forms.fiveguys.current) {
      form.classList.remove("show", "left");
      forms.initial.current.classList.add("left", "show");
      stepTwo.current.classList.remove("active");
    }
    if (form == forms.sdworkx.current) {
      form.classList.remove("show", "left");
      forms.fiveguys.current.classList.add("left", "show");
      stepThree.current.classList.remove("active");
      lineTwo.current.classList.remove("active");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const buttonName = e.nativeEvent.submitter.name;
    if (buttonName === "prev") {
      handlePrev(form);
    } else {
      nextForm(form);
    }
  };

  return (
    <div className="signup-content">
      <div className="container">
        <section className="step-indicator">
          <div className="step step1 active" ref={stepOne}>
            <div className="step-icon">1</div>
            <p>Cache</p>
          </div>
          <div className="indicator-line active" ref={lineOne}></div>
          <div className="step step2" ref={stepTwo}>
            <div className="step-icon">2</div>
            <p>FGP</p>
          </div>
          <div className="indicator-line" ref={lineTwo}></div>
          <div className="step step3" ref={stepThree}>
            <div className="step-icon">3</div>
            <p>Sdworx</p>
          </div>
        </section>
      </div>
      <form
        ref={forms.initial}
        onSubmit={handleSubmit}
        className={`initial-form show`}
      >
        <h1>Sign Up to Cache</h1>
        <input
          type="email"
          name="email"
          id="email"
          value={values.username}
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
          <button className="continue-btn" type="submit">
            Continue
          </button>
        </div>
      </form>
      <form
        ref={forms.fiveguys}
        onSubmit={handleSubmit}
        className={`five-guys-form`}
      >
        <h1>Five Guys People</h1>
        <input
          type="username"
          name="fguser"
          id="fguser"
          value={values.fguser}
          placeholder="Five Guys Username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="fgpass"
          id="fgpass"
          value={values.fgpass}
          placeholder="Five Guys Password"
          onChange={handleChange}
        />
        <div>
          <button className="continue-btn" type="submit">
            Continue
          </button>
          <button name="prev" className="prev-btn" type="submit">
            Go back
          </button>
        </div>
      </form>
      <form
        ref={forms.sdworkx}
        onSubmit={handleSubmit}
        className="sdworkx-form"
      >
        <h1>Sdworx Credentials</h1>
        <input
          type="username"
          name="sduser"
          id="sduser"
          value={values.sduser}
          placeholder="Sdworx Username"
          onChange={handleChange}
        />
        <input
          type="password"
          name="sdpass"
          id="sdpass"
          value={values.sdpass}
          placeholder="Sdworx Password"
          onChange={handleChange}
        />
        <div>
          <button className="continue-btn" type="submit">
            Submit
          </button>
          <button name="prev" className="prev-btn" type="submit">
            Go back
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
