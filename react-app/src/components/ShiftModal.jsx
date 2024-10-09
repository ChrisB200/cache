import { useEffect, useRef, useState } from "react";
import { editShiftTime } from "../api/work";
import styles from "../styles/ShiftModal.module.css";

function formatDateToISO(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Extracts only the 'YYYY-MM-DD' part
}

function ShiftModal({ shift, isModalOpen, setIsModalOpen }) {
  const [values, setValues] = useState({
    date: shift?.date || "",
    start: shift?.start || "",
    end: shift?.end || "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await editShiftTime(shift.id, values);
      console.log(result);
    } catch (err) {
      console.log(err)
    } finally {
      console.log("changed")
    }

  };

  const handleClose = (e) => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (shift) {
      setValues({
        date: formatDateToISO(shift.date),
        start: shift.start,
        end: shift.end,
      });
    }
  }, [shift]);

  return (
    <>
      <div className={isModalOpen ? styles.background : styles.hide} onClick={handleClose}/>
      <div className={isModalOpen ? styles.container : styles.hide}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.header}>Edit Shift</h2>
          <label className={styles.label}>
            Date
            <input
              className={styles.date}
              type="date"
              name="date"
              value={values.date}
              onChange={handleChange}
            />
          </label>
          <div className={styles.time}>
            <label className={styles.label}>
              Start
              <input
                type="time"
                name="start"
                value={values.start}
                onChange={handleChange}
              />
            </label>
<label className={styles.label}>
              End
              <input
                type="time"
                name="end"
                value={values.end}
                onChange={handleChange}
              />
            </label>
          </div>
          <button className={styles.button}>Submit</button>
        </form>
      </div>
    </>
  );
}

export default ShiftModal;
