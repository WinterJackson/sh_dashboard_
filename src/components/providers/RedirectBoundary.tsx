// src/components/providers/RedirectBoundary.tsx
import React from "react";

function RedirectBoundary({ children }: { children: React.ReactNode }) {
    try {
        return <>{children}</>;
    } catch (err) {
        console.error("Redirect Error:", err);
        return <div>Redirect failed. Please try again later.</div>;
    }
}

export default RedirectBoundary;
