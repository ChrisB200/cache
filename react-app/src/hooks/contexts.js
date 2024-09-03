// src/hooks/usePayslips.js

import { useContext } from 'react';
import {PayslipContext} from '../contexts/PayslipContext'; // Adjust import path as necessary

export const usePayslips = () => {
  const context = useContext(PayslipContext);
  if (!context) {
    throw new Error("usePayslips must be used within a PayslipProvider");
  }
  return context;
};

