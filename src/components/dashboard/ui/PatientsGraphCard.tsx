// File: src/components/dashboard/ui/PatientsGraphCard.tsx

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

const PatientsGraphCard: React.FC<PatientsGraphCardProps> = ({
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
        <div className="w-full grid p-4 pt-0 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm xl:text-base font-semibold">
                    Patients Per Month ({year})
                </h3>

                <div className="flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="group">
                            <button className="bg-bluelight/5 flex items-center justify-between p-2 border rounded max-w-[120px] text-sm text-right truncate">
                                <span className="truncate">{year}</span>
                                <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[80px] rounded-[5px]">
                            {years.map((yearOption) => (
                                <DropdownMenuItem
                                    key={yearOption}
                                    onClick={() => setYear(yearOption)}
                                    className="cursor-pointer rounded-[5px] mb-1 hover:bg-primary/10"
                                >
                                    {yearOption}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={appointmentsData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month">
                        <Label
                            value="Months"
                            offset={-20}
                            position="insideBottom"
                        />
                    </XAxis>
                    <YAxis />
                    <Tooltip content={<GraphTooltip />} />
                    <Legend align="right" />
                    <Bar
                        dataKey="Count"
                        fill="#016BD2"
                        background={{ fill: "#dbedff" }}
                        maxBarSize={60}
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PatientsGraphCard;
