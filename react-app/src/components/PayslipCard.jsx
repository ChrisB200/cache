import { useEffect, useState } from "react";
import { fetchForecastedPayslip } from "../api/work";
import { calculateTimeLeft } from "../utils/shift";
import specific from "../styles/PayslipCard.module.css"
import styles from "../styles/Card.module.css";
import "../index.css"

function PayslipCard() {
  const [nextPayslip, setNextPayslip] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const loadPayslip = async () => {
    try {
      const data = await fetchForecastedPayslip();
      setNextPayslip(data);
    } catch {}
  };

  useEffect(() => {
    if (!nextPayslip) return;
    const intervalId = setInterval(() => {
      const newDate = new Date(nextPayslip?.date);
      const remainingTime = calculateTimeLeft(newDate);
      setTimeLeft(remainingTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextPayslip]);

  useEffect(() => {
    loadPayslip();
  }, []);

  return (
    nextPayslip != null ? 
    <div className={styles.container}>
      <p className={styles.header}>Payslip</p>
      <div className={styles.content}>
        <div className={styles.nextDate}>
          <p className={styles.dayName}>
            {new Date(nextPayslip?.date).toLocaleString("default", {
              weekday: "short",
            })}
          </p>
          <p className={specific.day}>{new Date(nextPayslip?.date).getDate()}</p>
          <p className={styles.month}>
            {new Date(nextPayslip?.date).toLocaleString("default", {
              month: "short",
            })}
          </p>
        </div>
        <div className={styles.inner}>
          <div className={styles.top}>
            <p className={specific.cash}>
              {`£${(nextPayslip?.hours * nextPayslip?.rate).toFixed(2)}`}
            </p>
            <p className={styles.hours}>{nextPayslip?.hours.toFixed(2)}hrs</p>
          </div>
          <div className={styles.timer}>
            <div className={styles.section}>
              <p className={styles.value}>{timeLeft.days}</p>
              <p className={styles.name}>Days</p>
            </div>
            <div className={styles.section}>
              <p className={styles.value}>{timeLeft.hours}</p>
              <p className={styles.name}>Hours</p>
            </div>
            <div className={styles.section}>
              <p className={styles.value}>{timeLeft.minutes}</p>
              <p className={styles.name}>Mins</p>
            </div>
          </div>
        </div>
      </div>
    </div>
      : (<></>)
  );
}

export default PayslipCard;
