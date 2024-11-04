import "../index.css";
import styles from "../styles/History.module.css";
import { useShifts } from "../hooks/contexts";
import { useState } from "react";
import PayslipSelector from "./PayslipSelector";
import ShiftRow from "./ShiftRow";
import ShiftModal from "./ShiftModal";

function ShiftRecord({ currentPayslip }) {
  const { shifts } = useShifts();
  const [currentShift, setCurrentShift] = useState(null);
  const [toggleTimecard, setToggleTimecard] = useState("timecard");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalView = () => {
    isModalOpen ? setIsModalOpen(false) : setIsModalOpen(true);
  }
  
  return currentPayslip ? (
    <>
      <ShiftModal
        shift={currentShift}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <div className={`${styles.container} ${styles.scontainer}`}>
        <div className={styles.record}>
          <select
            name="type"
            id="type"
            value={toggleTimecard}
            onChange={(e) => setToggleTimecard(e.target.value)}
          >
            <option value="timecard">Timecard</option>
            <option value="schedule">Schedule</option>
          </select>
          <div className={styles.grid}>
            {currentPayslip.shifts.length == 0 ? (
              <p>No history of shifts</p>
            ) : (
              currentPayslip.shifts.map((id) => {
                const shift = shifts[toggleTimecard].find((shift) => {
                  return id === shift.id;
                });

                if (shift === undefined) return;
                return (
                  <ShiftRow
                    shift={shift}
                    rate={currentPayslip.rate}
                    setCurrentShift={setCurrentShift}
                      toggleModalView={toggleModalView}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}

function History() {
  const [currentPayslip, setCurrentPayslip] = useState(null);

  return (
    <>
      <div className={styles.content}>
        <PayslipSelector
          currentPayslip={currentPayslip}
          setCurrentPayslip={setCurrentPayslip}
        />
        <ShiftRecord currentPayslip={currentPayslip} />
      </div>
    </>
  );
}

export default History;
