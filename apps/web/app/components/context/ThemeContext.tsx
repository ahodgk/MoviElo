"use client";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
// import Cookies from "js-cookie";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextProps {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
}

export const getThemeCookieFn = createServerFn().handler(async (_req) => {
  return getCookie("theme");
});

export const setThemeCookieFn = createServerFn()
  .validator((theme: "light" | "dark") => {
    if (theme !== "light" && theme !== "dark") {
      throw new Error("Invalid theme");
    }
    return theme;
  })
  .handler(async (req) => {
    const theme = req.data;
    setCookie("theme", theme);
  });

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  defaultTheme?: string;
}> = ({ children, defaultTheme }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(
    defaultTheme === "light" || defaultTheme === "dark"
      ? defaultTheme
      : typeof window !== "undefined" &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  );
  const consentFlag =
    typeof window !== "undefined"
      ? (window?.Cookiebot?.consent?.preferences ?? false)
      : false;

  const setMetaFlag = useCallback((theme: "light" | "dark") => {
    console.log("set meta flag");

    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme);
  }, []);

  // useEffect(() => {
  //   if (consentFlag) {
  //     const storedTheme = Cookies.get("theme");
  //     if (storedTheme === "light" || storedTheme === "dark") {
  //       setThemeState(storedTheme);
  //     }
  //   }
  // }, [consentFlag]);

  useEffect(() => {
    if (consentFlag) {
      // Cookies.set("theme", theme, { expires: 365 });
    }
    setMetaFlag(theme);
    setThemeCookieFn({ data: theme });
  }, [theme, consentFlag, setMetaFlag]);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
