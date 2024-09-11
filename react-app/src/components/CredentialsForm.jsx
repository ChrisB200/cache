import React, { useRef, forwardRef } from "react";
import "../index.css";
import styles from "../styles/CredentialsForm.module.css";

const CredentialsForm = forwardRef(
  ({ header, values, setValues, submit, inputs, prev = null, hide = false }, ref) => {
    const internalFormRef = useRef(null);
    const formRef = ref || internalFormRef;

    const handleChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value });
      e.target.classList.remove(styles.error);
    };

    const validation = async (e) => {
      e.preventDefault();

      const form = e.target;
      const isValid = form.checkValidity();

      if (!isValid) {
        Array.from(form.elements).forEach((element) => {
          if (element.tagName === "INPUT" && !element.validity.valid) {
            element.classList.add(styles.error);
          }
        });
        return;
      }
      try {
        submit.onClick(e);
      } catch {
        form.classList.add(styles.error);
      }
    };

    const prevClick = async (e) => {
      e.preventDefault();
      prev.onClick(e);
    };

    return (
      <div className={`${styles.container}`}>
        <form
          className={`${styles.credentials} ${hide ? "hide" : ""}`}
          onSubmit={validation}
          ref={formRef}
          noValidate
        >
          <h1>{header}</h1>
          <input
            type={inputs.first.type}
            id={inputs.first.type}
            name={inputs.first.name}
            value={values[inputs.first.name]}
            placeholder={inputs.first.placeholder}
            onChange={handleChange}
            required
          />
          <input
            type={inputs.second.type}
            id={inputs.second.type}
            name={inputs.second.name}
            value={values[inputs.second.name]}
            placeholder={inputs.second.placeholder}
            onChange={handleChange}
            required
          />
          <div className={styles.buttons}>
            <button className={styles.continue} type="submit">
              {submit.text}
            </button>
            {prev != null ? (
              <button className={styles.prev} onClick={prevClick}>
                {prev.text}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    );
  }
);

export default CredentialsForm;

