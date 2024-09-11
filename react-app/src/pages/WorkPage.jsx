import { useState, useEffect, useRef } from "react";
import "../index.css";
import "../styles/Work.module.css";
import { PayslipProvider } from "../contexts/PayslipContext";
import { ShiftProvider } from "../contexts/ShiftContext";
import Navbar from "../components/Navbar";
import { ShiftCard } from "../components/Card";
import { fetchForecastedShifts } from "../api/work";
import Sidebar from "../components/WorkSidebar";


function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [recentShifts, setRecentShifts] = useState(null);

  const loadRecent = async () => {
    try {
      const data = await fetchForecastedShifts();
      setRecentShifts(data)
    } catch {
      console.log ("hey");
    } finally {
    }
  }

  useEffect(() => {
    loadRecent();
  }, [])

  return (
    <PayslipProvider>
      <ShiftProvider>
        <div className="content">
          <Navbar></Navbar>
          <ShiftCard></ShiftCard>

          <Sidebar currentDate={currentDate} setCurrentDate={setCurrentDate} />
        </div>
      </ShiftProvider>
    </PayslipProvider>
  );
}

export default Work;
