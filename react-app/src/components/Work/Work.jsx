import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import "../../index.css";
import "./Work.css";
import httpClient, { BASE_API_URL } from "../../utilities/httpClient";

// Fetch data helper function
async function fetchData(url, func) {
  await httpClient.get(url).then((response) => {
    func(response.data);
  });
}

function Work() {
  const [payslips, setPayslips] = useState([]);
  const [shifts, setShifts] = useState({
    timecard: [],
    schedule: [],
  });

  // Function to sort shifts into timecard and schedule
  const sortShifts = (data) => {
    const timecardShifts = [];
    const scheduleShifts = [];

    data.forEach((shift) => {
      if (shift.type === "Timecard") {
        timecardShifts.push(shift);
      } else if (shift.type === "Schedule") {
        scheduleShifts.push(shift);
      }
    });

    // Update shifts state correctly
    setShifts((prevShifts) => ({
      timecard: [...prevShifts.timecard, ...timecardShifts],
      schedule: [...prevShifts.schedule, ...scheduleShifts],
    }));
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData(`${BASE_API_URL}/work/payslips`, setPayslips);
    fetchData(`${BASE_API_URL}/work/shifts`, sortShifts);
  }, []);

  return (
    <>
      <Calendar payslips={payslips} shifts={shifts} />
    </>
  );
}

export default Work;

