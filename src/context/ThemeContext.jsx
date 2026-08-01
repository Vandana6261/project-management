import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isThemeLight, setIsThemeLight] = useState(() =>
    document.documentElement.classList.contains("light"),
  );

  console.log("Theme provider rendering");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersLight = window.matchMedia(
      "(prefers-color-scheme: light)",
    ).matches;
    const shouldBeLight =
      savedTheme === "light" || (!savedTheme && systemPrefersLight);

    if (shouldBeLight) {
      document.documentElement.classList.add("light");
      setIsThemeLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsThemeLight(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("light")) {
      html.classList.remove("light");
      setIsThemeLight(false);
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.add("light");
      setIsThemeLight(true);
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isThemeLight,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context)
    new Error("useThemeContext must be used within a ThemeProvider");
  return context;
}
