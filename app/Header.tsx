import { Github, Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

const Header = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <div className="fixed top-0 w-full flex justify-between items-center p-[20px] shadow-md">
      <h1>IndianTaxCalculator</h1>
      <div className="flex items-center gap-[20px] px-[10px]">
        <a
          href="https://github.com/bhagirathpaliyal/indianTaxCalculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={20} />
        </a>
        <Button
          onClick={toggleDarkMode}
          className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md flex items-center gap-2"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Header;
