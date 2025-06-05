// src/hooks/useFetchAllHospitals.ts

import { useQuery } from "@tanstack/react-query";
import { loadHospitals } from "@/lib/data-access/hospitals/loaders";

export const useFetchAllHospitals = () => {
    return useQuery({
        queryKey: ["all-hospitals"],
        queryFn: () => loadHospitals(undefined),
        staleTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};
