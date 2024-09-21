import "../index.css";
import styles from "../styles/History.module.css";
import { usePayslips, useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import { mostRecentObject } from "../utils/shift";

function History() {
  const { payslips } = usePayslips();
  const { shifts } = useShifts();
  const [currentPayslip, setCurrentPayslip] = useState(null);
  const [totalHours, setTotalHours] = useState(null);
  const [toggleTimecard, setToggleTimecard] = useState("timecard");

  const options = {
    month: "short",
    day: "2-digit",
  };

  const shiftOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
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
    if (!currentPayslip || !shifts.timecard) return 0; // Ensure no errors if shifts or currentPayslip are missing

    return currentPayslip.shifts.reduce((total, id) => {
      const shift = shifts.timecard.find((shift) => shift.id === id);
      return shift ? total + shift.hours : total; // Add hours if shift is found, otherwise keep total unchanged
    }, 0);
  };

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

  return currentPayslip ? (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.payslip}>
            <div className={styles.date}>
              <button onClick={handlePrev}>&#60;</button>
              <div className={styles.header}>
                <p className={styles.year}>
                  {currentPayslip.date.getFullYear()}
                </p>
                <h3>
                  {currentPayslip.date.toLocaleString("default", options)}
                </h3>
              </div>
              <button onClick={handleNext}>&#62;</button>
            </div>
            <p className={styles.total}>£{currentPayslip.net}</p>
            <div className={styles.info}>
              <ul className={styles.labels}>
                <li className={styles.label}>Shifts</li>
                <li className={styles.label}>Hours</li>
                <li className={styles.label}>Rate</li>
                <li className={styles.label}>Base</li>
                <li className={styles.label}>Other</li>
              </ul>
              <ul className={styles.values}>
                <li>{currentPayslip.shifts.length}</li>
                <li>{totalHours.toFixed(2)}</li>
                <li>£{currentPayslip.rate}</li>
                <li>£{(totalHours * currentPayslip.rate).toFixed(2)}</li>
                <li>
                  £
                  {(
                    currentPayslip.net -
                    totalHours * currentPayslip.rate
                  ).toFixed(2)}
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.record}>
            <select
              name="type"
              id="type"
              value={toggleTimecard}
              onChange={(e) => setToggleTimecard(e.target.value)}
            >
              <option value="timecard">Timecard</option>
              <option value="schedule">Schedule</option>
            </select>
            <div className={styles.gridbox}>
              <div className={styles.grid}>
                <p className={styles.label}>Date</p>
                <p className={styles.label}>Time</p>
                <p className={styles.label}>Hours</p>
                <p className={styles.label}>Pay</p>
                {currentPayslip.shifts.length == 0 ? (
                  <p>No history of shifts</p>
                ) : (
                  currentPayslip.shifts.map((id) => {
                      console.log(currentPayslip)
                    const shift = shifts[toggleTimecard].find((shift) => {
                      return id === shift.id;
                    });

                    if (shift === undefined) return;
                    return (
                      <>
                        <p>
                          {new Date(shift.date).toLocaleString(
                            "default",
                            shiftOptions,
                          )}
                        </p>
                        <p>
                          {shift.start} - {shift.end}
                        </p>
                        <p>{shift.hours.toFixed(1)}</p>
                        <p>£{(shift.hours * currentPayslip.rate).toFixed(2)}</p>
                      </>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

export default History;
