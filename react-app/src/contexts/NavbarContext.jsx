import { createContext, useState, useEffect } from "react";

export const NavbarContext = createContext(null);

export const NavbarProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbar] = useState(false);

  const toggleNavbar = () => {
    setIsNavbar((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1100) {
        setIsNavbar(false);
      } else {
        setIsNavbar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};
