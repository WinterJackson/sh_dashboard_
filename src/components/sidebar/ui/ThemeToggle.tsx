// src/components/sidebar/ui/ThemeToggle.tsx

"use client";

import { useState, useEffect } from "react";
import { setTheme, getStoredTheme } from "@/lib/utils/theme";

const themes = [
    { id: "light", label: "Light", icon: "🌞" },
    { id: "dark", label: "Dark", icon: "🌙" },
    { id: "red", label: "Red", icon: "🔥" },
] as const;

export default function ThemeToggle() {
    const [active, setActive] = useState<"light" | "dark" | "red">("light");

    useEffect(() => {
        setActive(getStoredTheme());
    }, []);

    const handleThemeChange = (theme: typeof active) => {
        setTheme(theme);
        setActive(theme);
    };

    return (
        <div className="flex justify-between gap-2 p-1 rounded-lg bg-slate shadow-sm shadow-shadow-main">
            {themes.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => handleThemeChange(id)}
                    className={`w-full flex items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium capitalize transition ${
                        active === id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent text-accent-foreground"
                    }`}
                    aria-label={`${label} Theme`}
                >
                    <span>{icon}</span>
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    );
}
