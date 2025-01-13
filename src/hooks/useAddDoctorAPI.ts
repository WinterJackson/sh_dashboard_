// src/hooks/useAddDoctorAPI.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDoctorAPI } from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";

export const useAddDoctorAPI = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: {
            doctorData: {
                firstName: string;
                lastName: string;
                email: string;
                gender: string;
                hospitalId: number;
                departmentId: number;
                specializationId: number;
                serviceId?: number;
                phoneNo: string;
                dateOfBirth: string;
                qualifications?: string;
                about?: string;
                status?: string;
                profileImageUrl?: string;
            };
            user?: { role: Role; hospitalId: number | null; userId: string | null };
        }) => addDoctorAPI(data.doctorData, data.user),
        onSuccess: () => {
            // Invalidate doctors cache to reflect changes
            queryClient.invalidateQueries({ queryKey: ["doctors"] });
        },
        onError: (error) => {
            console.error("Error adding doctor:", error);
        },
    });
};