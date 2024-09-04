import { createContext, useContext } from "react";

export const PayslipContext = createContext(null);

export function usePayslipContext() {
  const payslips = useContext(PayslipContext);

  if (payslips === null) {
  }

}
