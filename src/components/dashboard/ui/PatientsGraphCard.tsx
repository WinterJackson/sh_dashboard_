// File: src/components/dashboard/ui/PatientsGraphCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";
import GraphTooltip from "@/components/ui/graph-tooltip";

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

// Corrected mock data with number keys
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

const PatientsGraphCard: React.FC<PatientsGraphCardProps> = ({ session, appointments }) => {
    const role = session?.user?.role;
    const hospitalId = session?.user?.hospitalId;

    const [appointmentsData, setAppointmentsData] = useState<PatientCountPerMonth[]>(mockAppointmentsData["2024"]); // test code
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        // Uncomment this section to fetch real data

        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // const getAppointments = () => {
        //     try {
        //         const filteredAppointments = role !== "SUPER_ADMIN" && hospitalId
        //             ? appointments.filter(app => app.hospitalId === hospitalId)
        //             : appointments;
    
        //         // Initialize all months with a Count of 0
        //         const initialData: PatientCountPerMonth[] = months.map(month => ({
        //             month,
        //             Count: 0,
        //         }));
    
        //         // Count unique patients per month
        //         const uniquePatientsByMonth: { [key: string]: Set<number> } = {};
    
        //         filteredAppointments.forEach((appointment) => {
        //             const appointmentDate = new Date(appointment.appointmentDate);
        //             const appointmentYear = appointmentDate.getFullYear();
    
        //             if (appointmentYear === year) {
        //                 const monthIndex = appointmentDate.getMonth();
        //                 const month = months[monthIndex];
    
        //                 if (!uniquePatientsByMonth[month]) {
        //                     uniquePatientsByMonth[month] = new Set();
        //                 }
    
        //                 uniquePatientsByMonth[month].add(appointment.patientId);
        //             }
        //         });
    
        //         // Update the initial data with actual counts
        //         const finalData = initialData.map((data) => ({
        //             ...data,
        //             Count: uniquePatientsByMonth[data.month]?.size || 0,
        //         }));
    
        //         setAppointmentsData(finalData);
        //     } catch (error) {
        //         console.error("Error processing appointments:", error);
        //     }
        // };
    
        // getAppointments();

        // eslint-disable-next-line react-hooks/exhaustive-deps
        setAppointmentsData(mockAppointmentsData[year]);
    }, [year, role, hospitalId]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(Number(event.target.value));
    };

    return (
        <div className="w-full grid p-4 pt-0 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm xl:text-base font-semibold">
                    Patients Per Month ({year})
                </h3>
                <div className="flex items-center text-sm xl:text-base">
                    <label htmlFor="year-sselect" className="mr-2">
                        Select Year:
                    </label>
                    <select
                        id="year-select"
                        value={year}
                        onChange={handleYearChange}
                        className="p-2 border rounded"
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <option
                                key={i}
                                value={(
                                    new Date().getFullYear() - i
                                ).toString()}
                            >
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
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
                        maxBarSize={40}
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PatientsGraphCard;
