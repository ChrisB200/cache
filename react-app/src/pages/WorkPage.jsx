import { useState, useEffect, useRef } from "react";
import "../index.css";
import styles from "../styles/WorkPage.module.css"
import { PayslipProvider } from "../contexts/PayslipContext";
import { ShiftProvider } from "../contexts/ShiftContext";
import Navbar from "../components/Navbar";
import { ShiftCard } from "../components/ShiftCard";
import Sidebar from "../components/WorkSidebar";
import PayslipCard from "../components/PayslipCard";
import History from "../components/History";


function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());


  return (
    <PayslipProvider>
      <ShiftProvider>
        <div className="content">
          <Navbar></Navbar>
          <div className={styles.widgets}>
            <div className={styles.upcoming}>
              <h2 className={styles.header}>Upcoming</h2>
              <div>
                <ShiftCard></ShiftCard>
                <PayslipCard></PayslipCard>
              </div>
            </div>
            <div className={styles.history}>
              <h2 className={styles.header}>History</h2>
              <div>
                <History></History>
              </div>
            </div>
          </div>
          <Sidebar currentDate={currentDate} setCurrentDate={setCurrentDate} />
        </div>
      </ShiftProvider>
    </PayslipProvider>
  );
}

export default Work;
