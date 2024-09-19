import "../index.css";
import styles from "../styles/History.module.css";
import { usePayslips, useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import { mostRecentObject } from "../utils/shift";

function History() {
  const { payslips } = usePayslips();
  const { shifts } = useShifts();
  const [currentPayslip, setCurrentPayslip] = useState(null);
  const currentDate = new Date();

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  }

  const totalHours = (currentPayslip) => {
    if (!currentPayslip) return;

    let total = 0;
    currentPayslip.shifts.map((id) => {
      total += shifts.timecard.find((shift) => {
        return shift.id === id;
      }).hours;
    });
    console.log(total)
  };

  useEffect(() => {
    const recentSlip = mostRecentObject(payslips, "date")
    console.log(shifts)
    console.log(payslips)
    totalHours(recentSlip)
    setCurrentPayslip(recentSlip);
  }, [payslips])

  return (currentPayslip ? <>
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.payslip}>
          <div className={styles.date}>
            <button>&#60;</button>
            <h2>{currentDate.toLocaleString("default", options)}</h2>
            <button>&#62;</button>
          </div>
          <p className={styles.total}>£{currentPayslip.net.toFixed(2)}</p>
          <div className={styles.info}>
            <ul className={styles.labels}>
              <li className={styles.label}>Shifts</li>
              <li className={styles.label}>Hours</li>
              <li className={styles.label}>Rate</li>
              <li className={styles.label}>Net</li>
              <li className={styles.label}>Other</li>
            </ul>
            <ul className={styles.values}>
              <li>6</li>
              <li>23</li>
              <li>£{currentPayslip.rate}</li>
              <li>£278.12</li>
              <li>£50.13</li>
            </ul>
          </div>
        </div>
        <div className={styles.record}>
          <select name="type" id="type">
            <option value="Timecard">Timecard</option>
            <option value="Schedule">Schedule</option>
          </select>
          <div className={styles.grid}>
            <p className={styles.label}>Date</p>
            <p className={styles.label}>Time</p>
            <p className={styles.label}>Hours</p>
            <p className={styles.label}>Pay</p>
          </div>
        </div>
      </div>
    </div>
  </> : <></>);
}

export default History;
