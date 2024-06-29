// File: src/app/api/appointments/[appointmentId]/updateStatus.ts

export async function updateAppointmentStatus(
    appointmentId: string,
    status: string,
    additionalData: Record<string, any> = {}
) {
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status, ...additionalData }),
        });

        if (!response.ok) {
            throw new Error(
                `Error updating appointment: ${response.statusText}`
            );
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update appointment");
    }
}
