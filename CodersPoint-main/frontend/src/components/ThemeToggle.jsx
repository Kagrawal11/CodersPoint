import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const getInitialTheme = () =>
    localStorage.getItem("theme") === "coderspoint-light"
        ? "coderspoint-light"
        : "coderspoint";

const ThemeToggle = ({ className = "" }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const isLight = theme === "coderspoint-light";

    return (
        <button
            type="button"
            aria-label="Toggle light/dark theme"
            className={`btn btn-ghost btn-circle ${className}`}
            onClick={() =>
                setTheme(isLight ? "coderspoint" : "coderspoint-light")
            }
        >
            {isLight ? (
                <Moon className="h-4 w-4" />
            ) : (
                <Sun className="h-4 w-4" />
            )}
        </button>
    );
};

export default ThemeToggle;
