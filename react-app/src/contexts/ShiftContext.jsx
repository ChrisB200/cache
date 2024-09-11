import { useEffect, useState } from "react";
import { createContext } from "react";
import { fetchAllShifts } from "../api/work";
import { sortShifts } from "../utils/shift";

export const ShiftContext = createContext(null);

export const ShiftProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shifts, setShifts] = useState({
    timecard: [],
    schedule: [],
  });

  const loadShifts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllShifts();
      const sortedData = sortShifts(data)
      setShifts(sortedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShifts();
  }, []);

  return (
    <ShiftContext.Provider
      value={{ shifts, isLoading, error, loadShifts, setShifts }}
    >
      {children}
    </ShiftContext.Provider>
  );
};
