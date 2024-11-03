import { useRef, useEffect } from "react";
import styles from "../styles/ShiftPanel.module.css"
import "../index.css"
import { convertTime, timeStr } from "../utils/shift";

function ShiftPanel({ shift, isSelected, onClick }) {
  const shiftRef = useRef(null);
  const shiftDate = new Date(shift.date);
  const formattedDate = shiftDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  useEffect(() => {
    if (isSelected && shiftRef.current) {
      shiftRef.current.classList.add(styles.selected);
      requestAnimationFrame(() => {
        shiftRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
    if (!isSelected) {
      shiftRef.current.classList.remove(styles.selected);
    }
  }, [isSelected]);

  return (
    <div className={styles.container} ref={shiftRef} onClick={onClick}>
      <div className={styles.info}>
        <div className={styles.date}>
          <p className={styles.day}>
            {shiftDate.toLocaleDateString("default", { weekday: "short" })}
          </p> 
          <p className={styles.short}>{formattedDate}</p>
        </div>
        <div className={styles.details}>
          <strong>
            <p>
              {timeStr(shift.start)} - {timeStr(shift.end)}
            </p>
          </strong>
          <p>{shift.type}</p>
        </div>
      </div>
      <div className={styles.hours}>
        <p className={styles.cash}>£{(shift.hours * shift.rate).toFixed(2)}</p>
        <p className={styles.grayed}>{shift.hours.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default ShiftPanel;
