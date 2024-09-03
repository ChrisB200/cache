import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { fetchAllPayslips } from "../api/work";

export const PayslipContext = createContext(null);

export const PayslipProvider = ({ children }) => {
  const [payslips, setPayslips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPayslips = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllPayslips();
      setPayslips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPayslips();
  }, [])

  return (
    <PayslipContext.Provider value={{ payslips, isLoading, error, loadPayslips }}>
      {children}
    </PayslipContext.Provider>
  );
}

