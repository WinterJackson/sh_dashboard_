// src/hooks/useFormatDate.ts

// Helper function to format date
export function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}