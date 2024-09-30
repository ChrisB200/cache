import { useContext } from "react";
import { FontContext } from "../contexts/FontContext";
import { NavbarContext } from "../contexts/NavbarContext";
import { PayslipContext } from "../contexts/PayslipContext"; // Adjust import path as necessary
import { ShiftContext } from "../contexts/ShiftContext";
import { SidebarContext } from "../contexts/SidebarContext";

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

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error("useFont must be used within a FontProvider");
  } 
  return context;
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
