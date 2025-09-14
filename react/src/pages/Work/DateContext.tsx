import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";

interface DateContextValues {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  resetDate: () => void;
  prevMonth: () => void;
  nextMonth: () => void;
  getDay: () => number;
  getMonth: () => number;
  getYear: () => number;
  getMonthName: () => string;
}

export const DateContext = createContext<DateContextValues | null>(null);

interface DateProviderProps {
  children: ReactNode;
}

export function DateProvider({ children }: DateProviderProps) {
  const [date, setDate] = useState<Date>(new Date());

  const resetDate = () => {
    setDate(new Date());
  };

  const prevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const getDay = () => {
    return date.getDay();
  };

  const getMonth = () => {
    return date.getMonth();
  };

  const getYear = () => {
    return date.getFullYear();
  };

  const getMonthName = () => {
    return date.toLocaleString("default", { month: "long" });
  };

  return (
    <DateContext.Provider
      value={{
        date,
        setDate,
        resetDate,
        prevMonth,
        nextMonth,
        getDay,
        getMonth,
        getYear,
        getMonthName,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

export const useDate = (): DateContextValues => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
