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
                gender: string | null;
                hospitalId: number;
                departmentId: number;
                specializationId: number;
                serviceId?: number | null;
                phoneNo: string;
                dateOfBirth: string;
                qualifications?: string;
                bio?: string;
                status?: string;
                profileImageUrl?: string | null;
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