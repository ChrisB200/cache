import dots from "../assets/icons/three-dot-menu.png";
import ClickableIcon from "./ClickableIcon";
import styles from "../styles/ShiftRow.module.css";
import { timeStr } from "../utils/shift";

function ShiftRow({ shift, rate, setCurrentShift, toggleModalView }) {
  const shiftDate = new Date(shift.date);
  const formattedDate = shiftDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
  });

  const toggleModal = () => {
    setCurrentShift(shift);
    toggleModalView();
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
                {(`${timeStr(shift.start)} - ${timeStr(shift.end)}`)}
              </p>
              <div>
                <div className={styles.options}>
                  <ClickableIcon icon={dots} onClick={toggleModal} />
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
