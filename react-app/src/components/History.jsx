import "../index.css";
import styles from "../styles/History.module.css";
import { usePayslips, useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import { mostRecentObject } from "../utils/shift";
import dots from "../assets/icons/three-dot-menu.png";
import ClickableIcon from "./ClickableIcon";
import PayslipSelector from "./PayslipSelector";

function ShiftDropdown({ shift, showModal, isOptionsOpen, toggleOptions }) {
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
                  <ShiftDropdown
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

function ShiftRecord({ currentPayslip }) {
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



function History() {
  const [currentPayslip, setCurrentPayslip] = useState(null);

  return (
    <>
      <div className={styles.content}>
        <PayslipSelector
          currentPayslip={currentPayslip}
          setCurrentPayslip={setCurrentPayslip}
        />
        <ShiftRecord currentPayslip={currentPayslip} />
      </div>
    </>
  );
}

export default History;
