// src/components/providers/NotFoundBoundary.tsx
import React from "react";

function NotFoundBoundary({ children }: { children: React.ReactNode }) {
    try {
        return <>{children}</>;
    } catch (err) {
        console.error("Not Found Error:", err);
        return <div>Page not found. Please check the URL or return to the homepage.</div>;
    }
}

export default NotFoundBoundary;
