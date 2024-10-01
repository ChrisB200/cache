import "../index.css";
import styles from "../styles/History.module.css";
import { usePayslips, useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import { mostRecentObject } from "../utils/shift";
import dots from "../assets/icons/three-dot-menu.png";
import ClickableIcon from "./ClickableIcon";

function ShiftOptions({ shift, showModal, isOptionsOpen, toggleOptions }) {
  const chooseOption = (e) => {
    if (e.target.value === "edit") {
      showModal();
    }
    toggleOptions(); // Close options after choosing
  };

  return (
    <div className={`${isOptionsOpen ? styles.optbtn : styles.hide}`}>
      <button value="remove" onClick={chooseOption}>Remove</button>
      <button value="edit" onClick={chooseOption}>Edit</button>
    </div>
  );
}

function ShiftRow({ shift, rate }) {
  const shiftDate = new Date(shift.date);
  const [isOptionsOpen, setOptionsOpen] = useState(false);
  const formattedDate = shiftDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  const toggleDropdown = () => {
    setOptionsOpen((prev) => !prev); 
  };

  return (
    <>
      <div className={styles.rowcontainer}>
        <div className={styles.row}>
          <div className={styles.box}>
            <p className={styles.day}>
              {shiftDate.toLocaleDateString("default", { weekday: "short" })}
            </p>
            <p className={styles.date}>{formattedDate}</p>
          </div>
          <div className={styles.details}>
            <div className={styles.shiftHeader}>
              <p className={styles.time}>
                {shift.start} - {shift.end}
              </p>
              <div>
                <div className={styles.optcontainer}>
                  <ClickableIcon icon={dots} onClick={toggleDropdown} />
                  <ShiftOptions
                    shift={shift}
                    showModal={() => console.log("Modal opened")} // Replace with modal logic
                    isOptionsOpen={isOptionsOpen}
                    toggleOptions={toggleDropdown}
                  />
                </div>
              </div>
            </div>
            <div className={styles.money}>
              <p className={styles.hours}>{shift.hours.toFixed(2)}hrs</p>
              <p className={styles.amount}>
                £{(shift.hours * rate).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ShiftHistory({ currentPayslip }) {
  const { shifts } = useShifts();
  const [toggleTimecard, setToggleTimecard] = useState("timecard");

  return currentPayslip ? (
    <>
      <div className={`${styles.container} ${styles.scontainer}`}>
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
          <div className={styles.grid}>
            {currentPayslip.shifts.length == 0 ? (
              <p>No history of shifts</p>
            ) : (
              currentPayslip.shifts.map((id) => {
                const shift = shifts[toggleTimecard].find((shift) => {
                  return id === shift.id;
                });

                if (shift === undefined) return;
                return <ShiftRow shift={shift} rate={currentPayslip.rate} />;
              })
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

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
    if (!currentPayslip || !shifts.timecard) return 0; // Ensure no errors if shifts or currentPayslip are missing

    return currentPayslip.shifts.reduce((total, id) => {
      const shift = shifts.timecard.find((shift) => shift.id === id);
      return shift ? total + shift.hours : total; // Add hours if shift is found, otherwise keep total unchanged
    }, 0);
  };

  return currentPayslip ? (
    <div className={`${styles.container} ${styles.pcontainer}`}>
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

function History() {
  const [currentPayslip, setCurrentPayslip] = useState(null);

  return (
    <>
      <div className={styles.content}>
        <PayslipSelector
          currentPayslip={currentPayslip}
          setCurrentPayslip={setCurrentPayslip}
        />
        <ShiftHistory currentPayslip={currentPayslip} />
      </div>
    </>
  );
}

export default History;
