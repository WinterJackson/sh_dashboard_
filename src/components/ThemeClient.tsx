// src/components/ThemeClient.tsx

"use client";

import { useEffect } from "react";
import { setTheme, getStoredTheme } from "@/lib/utils/theme";

export default function ThemeClient() {
    useEffect(() => {
        const theme = getStoredTheme();
        setTheme(theme);
    }, []);

    return null;
}
