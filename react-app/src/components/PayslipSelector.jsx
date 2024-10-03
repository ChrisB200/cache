import { useState, useEffect } from "react";
import { usePayslips, useShifts } from "../hooks/contexts";
import { mostRecentObject } from "../utils/shift";
import styles from "../styles/PayslipSelector.module.css"

function PayslipSelector({ currentPayslip, setCurrentPayslip }) {
  const { shifts } = useShifts();
  const { payslips } = usePayslips();
  const [totalHours, setTotalHours] = useState(null);

  useEffect(() => {
    const recentSlip = mostRecentObject(payslips, "date");
    if (recentSlip) {
      recentSlip.date = new Date(recentSlip.date);
      setCurrentPayslip(recentSlip);
    }
  }, [payslips]);

  useEffect(() => {
    setTotalHours(calculateTotalHours(currentPayslip));
  }, [shifts, currentPayslip]);
  const options = {
    month: "short",
    day: "2-digit",
  };

  const handlePrev = () => {
    const index = payslips.indexOf(currentPayslip);
    if (index < payslips.length - 1) {
      const prevSlip = payslips[index + 1];
      prevSlip.date = new Date(prevSlip.date);
      setCurrentPayslip(prevSlip);
    }
  };

  const handleNext = () => {
    const index = payslips.indexOf(currentPayslip);
    if (index > 0) {
      const nextSlip = payslips[index - 1];
      nextSlip.date = new Date(nextSlip.date);
      setCurrentPayslip(nextSlip);
    }
  };

  const calculateTotalHours = (currentPayslip) => {
    if (!currentPayslip || !shifts.timecard) return 0; 

    return currentPayslip.shifts.reduce((total, id) => {
      const shift = shifts.timecard.find((shift) => shift.id === id);
      return shift ? total + shift.hours : total; 
    }, 0);
  };

  return currentPayslip ? (
    <div className={styles.container}>
      <div className={styles.payslip}>
        <div className={styles.date}>
          <button onClick={handlePrev}>&#60;</button>
          <div className={styles.header}>
            <p className={styles.year}>{currentPayslip.date.getFullYear()}</p>
            <h3>{currentPayslip.date.toLocaleString("default", options)}</h3>
          </div>
          <button onClick={handleNext}>&#62;</button>
        </div>
        <p className={styles.total}>£{currentPayslip.net}</p>
        <div className={styles.info}>
          <ul className={styles.values}>
            <li className={styles.label}>Shifts</li>
            <li>{currentPayslip.shifts.length}</li>
            <li className={styles.label}>Hours</li>
            <li>{totalHours.toFixed(2)}</li>
            <li className={styles.label}>Rate</li>
            <li>£{currentPayslip.rate}</li>
            <li className={styles.label}>Base</li>
            <li>£{(totalHours * currentPayslip.rate).toFixed(2)}</li>
            <li className={styles.label}>Other</li>
            <li>
              £
              {(currentPayslip.net - totalHours * currentPayslip.rate).toFixed(
                2,
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default PayslipSelector;
