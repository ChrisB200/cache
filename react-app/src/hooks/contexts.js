// src/hooks/usePayslips.js

import { useContext } from "react";
import { PayslipContext } from "../contexts/PayslipContext"; // Adjust import path as necessary
import { ShiftContext } from "../contexts/ShiftContext";

export const usePayslips = () => {
  const context = useContext(PayslipContext);
  if (!context) {
    throw new Error("usePayslips must be used within a PayslipProvider");
  }
  return context;
};

export const useShifts = () => {
  const context = useContext(ShiftContext);
  if (!context) {
    throw new Error("useShifts must be used within a ShiftProvider");
  }
  return context;
};
