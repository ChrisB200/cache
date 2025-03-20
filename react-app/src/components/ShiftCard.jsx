import React from "react"
import { useState, useEffect } from "react";
import "../index.css";
import styles from "../styles/Card.module.css";
import specific from "../styles/ShiftCard.module.css";
import { calculateTimeLeft, convertTime, timeStr } from "../utils/shift";
import useFetch from "../hooks/useFetch";
import { BASE_API_URL } from "../utils/constants";
import { useUser } from "../hooks/contexts";

export function ShiftCard() {
  const { currentUser } = useUser();
  const { data: nextShift, error } = useFetch({
    url: `${BASE_API_URL}/shifts/next`,
    method: "get",
    withCredentials: true,
    key: ["get", "next", "shifts", "user", currentUser?.id],
    cache: {
      enabled: true,
      ttl: 60
    }
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!nextShift) return;

    const intervalId = setInterval(() => {
      const newDate = convertTime(nextShift.start);
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
                  {`${timeStr(nextShift.start)} - ${timeStr(nextShift.end)}`}
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
