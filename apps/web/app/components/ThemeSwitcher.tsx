"use client";
import { useEffect, useState } from "react";
// import { useTheme } from 'next-themes';
// import Button from '@mui/joy/Button';

import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  // const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") == "light" ? "light" : "dark",
  );
  useEffect(() => {
    // document.body.setAttribute('data-theme', theme);
    document.getElementsByTagName("html")[0]?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // document.body.classList.remove('light', 'dark');
    // document.body.classList.add(theme);
  }, [theme]);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return null;
  // }

  return (
    <button
      type="button"
      className={
        "w-fit rounded-full bg-transparent p-2 duration-200 hover:scale-110 hover:bg-gray-400 hover:bg-opacity-20 active:scale-100 " +
        className
      }
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <DarkMode className=" text-blue-500" />
      ) : (
        <LightMode className="text-orange-600" />
      )}
    </button>
  );
};
