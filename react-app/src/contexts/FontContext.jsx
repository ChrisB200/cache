import { createContext, useEffect, useState } from "react";


export const FontContext = createContext(null);

export const FontProvider = ({ children }) => {
  const defaultSize = useState("16px");
  const temp = localStorage.getItem("font-size")
  const [fontSize, setFontSize] = useState(temp ? temp : defaultSize);

  const increaseFontSize = () => {
    setFontSize(() => `${parseInt(fontSize) + 2}px`);
  }

  const decreaseFontSize = () => {
    setFontSize(() => `${parseInt(fontSize) - 2}px`);
  }

  const resetFontSize = () => {
    setFontSize(() => "16px");
  }

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize;
    localStorage.setItem("font-size", fontSize);
  }, [fontSize, defaultSize])

  return (
    <FontContext.Provider
      value={{ fontSize, increaseFontSize, decreaseFontSize, resetFontSize}}
    >
      {children}
    </FontContext.Provider>
  )
}
