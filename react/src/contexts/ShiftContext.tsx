// ShiftContext.tsx

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/types/shifts";
import useMonthShifts from "@/hooks/useMonthShifts";

interface ShiftContextValue {
  shifts: Shift[];
  fetchMonth: (date: Date) => void;
}

const ShiftContext = createContext<ShiftContextValue | undefined>(undefined);

interface ShiftProviderProps {
  children: ReactNode;
}

export function ShiftProvider({ children }: ShiftProviderProps) {
  const [date, setDate] = useState<Date>(new Date());
  const { shifts, isLoading, isError } = useMonthShifts({
    date,
  });

  const fetchMonth = (date: Date) => {
    setDate(date);
  };

  useEffect(() => {
    console.log(shifts);
  }, [shifts]);

  return (
    <ShiftContext.Provider value={{ shifts: shifts || [], fetchMonth }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShifts() {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error("useShifts must be inside ShiftProvider");
  return ctx;
}
