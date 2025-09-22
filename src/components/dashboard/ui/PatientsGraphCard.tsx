// src/components/dashboard/ui/PatientsGraphCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
} from "recharts";
import GraphTooltip from "@/components/ui/graph-tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";

interface PatientCountPerMonth {
    month: string;
    Count: number;
}

interface PatientsGraphCardProps {
    session: {
        user: {
            role: string;
            hospitalId: number | null;
        };
    };
    appointments: {
        appointmentDate: string;
        hospitalId: number;
        patientId: number;
    }[];
}

// mock data with number keys
const mockAppointmentsData: Record<number, PatientCountPerMonth[]> = {
    2024: [
        { month: "Feb", Count: 30 },
        { month: "Mar", Count: 25 },
        { month: "Jan", Count: 20 },
        { month: "Apr", Count: 28 },
        { month: "May", Count: 35 },
        { month: "Jun", Count: 40 },
        { month: "Jul", Count: 45 },
        { month: "Aug", Count: 50 },
        { month: "Sep", Count: 42 },
        { month: "Oct", Count: 38 },
        { month: "Nov", Count: 33 },
        { month: "Dec", Count: 37 },
    ],
    2025: [
        { month: "Jan", Count: 32 },
        { month: "Feb", Count: 28 },
        { month: "Mar", Count: 35 },
        { month: "Apr", Count: 45 },
        { month: "May", Count: 50 },
        { month: "Jun", Count: 60 },
        { month: "Jul", Count: 55 },
        { month: "Aug", Count: 58 },
        { month: "Sep", Count: 48 },
        { month: "Oct", Count: 50 },
        { month: "Nov", Count: 42 },
        { month: "Dec", Count: 47 },
    ],
};

const PatientsGraphCardComponent: React.FC<PatientsGraphCardProps> = ({
    session,
    appointments,
}) => {
    const role = session?.user?.role;
    const hospitalId = session?.user?.hospitalId;
    const [appointmentsData, setAppointmentsData] = useState<
        PatientCountPerMonth[]
    >(mockAppointmentsData[2024]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const years = Array.from(
        { length: 5 },
        (_, i) => new Date().getFullYear() - i
    );

    useEffect(() => {
        // REAL DATA IMPLEMENTATION (COMMENTED OUT)
        /*
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const getAppointments = () => {
            try {
                const filteredAppointments = role !== "SUPER_ADMIN" && hospitalId
                    ? appointments.filter(app => app.hospitalId === hospitalId)
                    : appointments;
    
                const initialData: PatientCountPerMonth[] = months.map(month => ({
                    month,
                    Count: 0,
                }));
    
                const uniquePatientsByMonth: { [key: string]: Set<number> } = {};
    
                filteredAppointments.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.appointmentDate);
                    const appointmentYear = appointmentDate.getFullYear();
    
                    if (appointmentYear === year) {
                        const monthIndex = appointmentDate.getMonth();
                        const month = months[monthIndex];
    
                        if (!uniquePatientsByMonth[month]) {
                            uniquePatientsByMonth[month] = new Set();
                        }
    
                        uniquePatientsByMonth[month].add(appointment.patientId);
                    }
                });
    
                const finalData = initialData.map((data) => ({
                    ...data,
                    Count: uniquePatientsByMonth[data.month]?.size || 0,
                }));
    
                setAppointmentsData(finalData);
            } catch (error) {
                console.error("Error processing appointments:", error);
            }
        };
    
        getAppointments();
        */

        // MOCK DATA IMPLEMENTATION
        setAppointmentsData(mockAppointmentsData[year]);
    }, [year, role, hospitalId, appointments]);

    return (
        <div className="w-full grid p-4 pt-0 rounded-2xl bg-card shadow-md shadow-shadow-main cursor-pointer">
            <div className="flex justify-between items-center mb-2 mt-3">
                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            className="group h-10 min-w-[130px]"
                        >
                            <button className="flex items-center justify-between p-2 border rounded-[10px] max-w-[120px] text-xs sm:text-sm bg-background-muted/50 hover:bg-background-muted/80">
                                <span className="truncate">{year}</span>
                                <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[80px] rounded-[5px]">
                            {years.map((yearOption) => (
                                <DropdownMenuItem
                                    key={yearOption}
                                    onClick={() => setYear(yearOption)}
                                    className="cursor-pointer rounded-[5px] mb-1 text-xs sm:text-sm hover:bg-primary/10"
                                >
                                    {yearOption}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <h3 className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold">
                    Patients Per Month ({year})
                </h3>
            </div>

            <div className="bg-slate rounded-[10px]">
                <ResponsiveContainer width="100%" height={380}>
                    <BarChart
                        data={appointmentsData}
                        margin={{ top: 50, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--border))"
                        />
                        <XAxis dataKey="month" stroke="hsl(var(--text-main))">
                            <Label
                                value="Months"
                                offset={-20}
                                position="insideBottom"
                                fill="hsl(var(--text-muted))"
                            />
                        </XAxis>
                        <YAxis stroke="hsl(var(--text-main))" />
                        <Tooltip content={<GraphTooltip />} />
                        <Legend align="right" />
                        <Bar
                            dataKey="Count"
                            fill="hsl(var(--primary))"
                            background={{ fill: "hsl(var(--light-accent))" }}
                            maxBarSize={60}
                            legendType="circle"
                            radius={[10, 10, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Custom props comparison to prevent unnecessary re-renders
function propsAreEqual(
    prevProps: PatientsGraphCardProps,
    nextProps: PatientsGraphCardProps
) {
    return (
        prevProps.session.user.role === nextProps.session.user.role &&
        prevProps.session.user.hospitalId ===
            nextProps.session.user.hospitalId &&
        prevProps.appointments.length === nextProps.appointments.length &&
        prevProps.appointments.every(
            (appt, index) =>
                appt.appointmentDate ===
                    nextProps.appointments[index].appointmentDate &&
                appt.hospitalId ===
                    nextProps.appointments[index].hospitalId &&
                appt.patientId === nextProps.appointments[index].patientId
        )
    );
}

export default React.memo(PatientsGraphCardComponent, propsAreEqual);
