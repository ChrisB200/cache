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
import menu from "../assets/icons/menu-burger.png"

function Work() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbar] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleNavbar = () => {
    setIsNavbar((prev) => !prev);
  }

  return (
    <PayslipProvider>
      <ShiftProvider>
        <div className="content">
          <Navbar isNavbarOpen={isNavbarOpen} toggleNavbar={toggleNavbar}/>
          <div className={styles.body}>
            <div className={styles.toggles}>
              <ClickableIcon
                className={isNavbarOpen ? styles.hide : styles.show}
                icon={menu}
                onClick={toggleNavbar}
              />
              <button onClick={toggleSidebar}>Cal</button>
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
            </div>
          </div>
          <Sidebar 
            currentDate={currentDate} 
            setCurrentDate={setCurrentDate} 
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar} 
          />
        </div>
      </ShiftProvider>
    </PayslipProvider>
  );
}

export default Work;

