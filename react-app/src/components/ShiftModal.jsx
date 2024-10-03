import { useEffect, useState } from "react";
import styles from "../styles/ShiftModal.module.css"

function ShiftModal({ shift, isModalOpen, setIsModalOpen }) {
  const [values, setValues] = useState({
    date: shift?.date,
    start: shift?.start,
    end: shift?.end,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    console.log("hey");
  }

  useEffect(() => {
    values.date = shift?.date;
    values.start = shift?.start;
    values.end = shift?.end;
  }, [shift])

  return (
    <>
      <div className={isModalOpen ? styles.background : styles.hide}/>
      <div className={isModalOpen ? styles.container : styles.hide}>
        <form className={styles.form} onChange={handleChange}>
          <h2>Edit Shift</h2>
          <input className={styles.date}type="date" name="date" />
          <div className={styles.time}>
            <input type="time" name="start" />
            <input type="time" name="end" />
          </div>
          <button className={styles.button}>Submit</button>
        </form>
      </div>
    </>
  );
}

export default ShiftModal;
