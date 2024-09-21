import { useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import "../index.css";
import styles from "../styles/Card.module.css";
import specific from "../styles/ShiftCard.module.css";
import Skeleton from "react-loading-skeleton";
import {
  calculateTimeLeft,
  combineDateAndTime,
  getNextShift,
} from "../utils/shift";

export function ShiftCard() {
  const { shifts, isLoading, error } = useShifts();
  const [nextShift, setNextShift] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (shifts && shifts.schedule) {
      const shift = getNextShift(shifts);
      setNextShift(shift);
    }
  }, [shifts]);

  useEffect(() => {
    if (!nextShift) return;

    const intervalId = setInterval(() => {
      const newDate = combineDateAndTime(nextShift.date, nextShift.start);
      const remainingTime = calculateTimeLeft(newDate);
      setTimeLeft(remainingTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextShift]);

  if (error) return <p>Error loading shifts</p>;

  return (
    <div className={styles.container}>
      <p className={styles.header}>Shift</p>
      <div className={styles.content}>
        {!nextShift ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={styles.nextDate}>
              <p className={styles.dayName}>
                {new Date(nextShift.date).toLocaleString("default", {
                  weekday: "short",
                })}
              </p>
              <p className={styles.day}>
                {new Date(nextShift.date).getDate()}
              </p>
              <p className={styles.month}>
                {new Date(nextShift.date).toLocaleString("default", {
                  month: "short",
                })}
              </p>
            </div>
            <div className={styles.inner}>
              <div className={styles.top}>
                <p className={specific.time}>
                  {`${nextShift.start} - ${nextShift.end}`}
                </p>
                <p className={styles.hours}>{`${nextShift.hours}hrs`}</p>
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
          </>
        )}
      </div>
    </div>
  );
}
