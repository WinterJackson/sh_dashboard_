// src/lib/utils/theme.ts

import { toast } from "@/components/ui/use-toast";

export function setTheme(theme: "light" | "dark" | "red") {
    document.body.classList.remove("light", "dark", "red");
    if (theme !== "light") {
        document.body.classList.add(theme);
    }
    localStorage.setItem("theme", theme);

    const icons: Record<typeof theme, string> = {
        light: "🌞",
        dark: "🌙",
        red: "🔥",
    };

    toast({
        title: `${icons[theme]} Switched to ${
            theme.charAt(0).toUpperCase() + theme.slice(1)
        } Mode`,
        description: "Your theme preference has been saved.",
        duration: 2000,
    });
}

export function getStoredTheme(): "light" | "dark" | "red" {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "red")
        return stored;

    const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
}
