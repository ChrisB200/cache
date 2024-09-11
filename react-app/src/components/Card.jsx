import { useShifts } from "../hooks/contexts";
import { useState, useEffect } from "react";
import "../index.css";
import "../styles/Card.module.css";

export function ShiftCard() {
  const { shifts, isLoading, error } = useShifts();
  const [nextShift, setNextShift] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = (shiftDate) => {
    const now = new Date();
    const difference = new Date(shiftDate) - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const combineDateAndTime = (date, time) => {
    const combinedDate = new Date(date); 
    const [startHours, startMinutes] = time.split(":").map(Number); 

    combinedDate.setHours(startHours, startMinutes);

    return combinedDate;
  };

  const getNextShift = () => {
    const today = new Date();
    const futureShifts = shifts?.schedule.filter(
      (shift) => combineDateAndTime(new Date(shift.date), shift.start) >= today,
    );

    if (futureShifts.length > 0) {
      setNextShift(futureShifts[0]);
    }
  };

  useEffect(() => {
    if (shifts && shifts.schedule) {
      getNextShift();
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading shifts</p>;

  return (
    <>
      <div className="card-container">
        <h3 className="card-header">Next Shift</h3>
        <div className="card-content">
          <div className="card-next-date">
            <p className="card-day-name">
              {new Date(nextShift?.date).toLocaleString("default", {
                weekday: "short",
              })}
            </p>
            <p className="card-day">{new Date(nextShift?.date).getDate()}</p>
            <p className="card-month">
              {new Date(nextShift?.date).toLocaleString("default", {
                month: "short",
              })}
            </p>
          </div>
          <div className="card-inner">
            <div className="card-top">
              <p className="card-time">
                {`${nextShift?.start} - ${nextShift?.end}`}
              </p>
              <p className="card-hours">8hrs</p>
            </div>
            <div className="card-timer">
              <div className="timer-section">
                <p className="section-value">{timeLeft.days}</p>
                <p className="section-name">Days</p>
              </div>
              <div className="timer-section">
                <p className="section-value">{timeLeft.hours}</p>
                <p className="section-name">Hours</p>
              </div>
              <div className="timer-section">
                <p className="section-value">{timeLeft.minutes}</p>
                <p className="section-name">Mins</p>
              </div>
              <div className="timer-section">
                <p className="section-value">{timeLeft.seconds}</p>
                <p className="section-name">Secs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
