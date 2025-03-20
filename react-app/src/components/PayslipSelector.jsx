import { useState, useEffect } from "react";
import { usePayslips } from "../hooks/contexts";
import { mostRecentObject } from "../utils/shift";
import styles from "../styles/PayslipSelector.module.css"


function PayslipSelector({ currentPayslip, setCurrentPayslip }) {
  const { payslips } = usePayslips();

  useEffect(() => {
    const recentSlip = mostRecentObject(payslips, "date");
    if (recentSlip) {
      recentSlip.date = new Date(recentSlip.date);
      setCurrentPayslip(recentSlip);
    }
  }, [payslips]);

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
            <li>{currentPayslip.hours.toFixed(2)}</li>
            <li className={styles.label}>Rate</li>
            <li>£{currentPayslip.rate}</li>
            <li className={styles.label}>Pay</li>
            <li>£{currentPayslip.pay.toFixed(2)}</li>
            <li className={styles.label}>Deductions</li>
            <li>£{currentPayslip.deductions.toFixed(2)}</li>
            <li className={styles.label}>Other</li>
            <li>
              £
              {(currentPayslip.pay - (currentPayslip.hours * currentPayslip.rate)).toFixed(
                2,
              )}
            </li>
            <li className={styles.label}>Net</li>
            <li>£{currentPayslip.net.toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default PayslipSelector;
