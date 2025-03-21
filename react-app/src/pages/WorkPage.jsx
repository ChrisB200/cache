import { useState } from "react";
import "../index.css";
import styles from "../styles/WorkPage.module.css";
import { PayslipProvider } from "../contexts/PayslipContext";
import { ShiftProvider } from "../contexts/ShiftContext";
import Navbar from "../components/Navbar";
import { ShiftCard } from "../components/ShiftCard";
import Sidebar from "../components/WorkSidebar";
import PayslipCard from "../components/PayslipCard";
import History from "../components/History";
import ClickableIcon from "../components/ClickableIcon";
import menu from "../assets/icons/menu-burger.png";
import calendar from "../assets/icons/calendar.png";
import { useSidebar, useNavbar } from "../hooks/contexts";
import WorkStatistics from "../components/WorkStatistics";

function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { isNavbarOpen, toggleNavbar } = useNavbar();


  return (
    <PayslipProvider>
      <ShiftProvider>
        <div className="content">
          <Navbar isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
          <div className={styles.body}>
            <div className={styles.toggles}>
              <ClickableIcon
                className={`${styles.icon} ${isNavbarOpen ? styles.hide : styles.show}`}
                icon={menu}
                onClick={toggleNavbar}
              />
              <ClickableIcon
                className={`${isSidebarOpen ? styles.hide : styles.cal}`}
                icon={calendar}
                onClick={toggleSidebar}
              />
            </div>
            <div className={styles.widgets}>
              <div className={styles.upcoming}>
                <h2 className={styles.header}>Upcoming</h2>
                <div>
                  <ShiftCard />
                  <PayslipCard />
                </div>
              </div>
              <div className={styles.history}>
                <h2 className={styles.header}>History</h2>
                <div>
                  <History />
                </div>
              </div>
              <div className={styles.statistics}>
                <h2 className={styles.header}>Statistics</h2>
                <WorkStatistics/>
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
