import { useState } from "react";
import dots from "../assets/icons/three-dot-menu.png";
import ClickableIcon from "./ClickableIcon";
import styles from "../styles/ShiftRow.module.css";

function ShiftDropdown({ shift, showModal, isOptionsOpen, toggleOptions }) {
  const chooseOption = (e) => {
    if (e.target.value === "edit") {
      showModal();
    }
    toggleOptions(); 
  };

  return (
    <div className={`${isOptionsOpen ? styles.dropdown : styles.hide}`}>
      <button value="remove" onClick={chooseOption}>
        Remove
      </button>
      <button value="edit" onClick={chooseOption}>
        Edit
      </button>
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
      <div>
        <div className={styles.row}>
          <div className={styles.box}>
            <p className={styles.day}>
              {shiftDate.toLocaleDateString("default", { weekday: "short" })}
            </p>
            <p className={styles.date}>{formattedDate}</p>
          </div>
          <div className={styles.details}>
            <div className={styles.header}>
              <p className={styles.time}>
                {shift.start} - {shift.end}
              </p>
              <div>
                <div className={styles.options}>
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

export default ShiftRow;
