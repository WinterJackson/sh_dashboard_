// File: src/components/dashboard/ui/PatientsGraphCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

interface PatientCountPerMonth {
    month: string;
    count: number;
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
    }[]; // Data passed as props
}

// Corrected mock data with number keys
const mockAppointmentsData: Record<number, PatientCountPerMonth[]> = {
    2023: [
        { month: "Feb", count: 30 },
        { month: "Mar", count: 25 },
        { month: "Jan", count: 20 },
        { month: "Apr", count: 28 },
        { month: "May", count: 35 },
        { month: "Jun", count: 40 },
        { month: "Jul", count: 45 },
        { month: "Aug", count: 50 },
        { month: "Sep", count: 42 },
        { month: "Oct", count: 38 },
        { month: "Nov", count: 33 },
        { month: "Dec", count: 37 },
    ],
    2024: [
        { month: "Jan", count: 32 },
        { month: "Feb", count: 28 },
        { month: "Mar", count: 35 },
        { month: "Apr", count: 45 },
        { month: "May", count: 50 },
        { month: "Jun", count: 60 },
        { month: "Jul", count: 55 },
        { month: "Aug", count: 58 },
        { month: "Sep", count: 48 },
        { month: "Oct", count: 50 },
        { month: "Nov", count: 42 },
        { month: "Dec", count: 47 },
    ],
};

const PatientsGraphCard: React.FC<PatientsGraphCardProps> = ({ session, appointments }) => {
    const role = session.user.role;
    const hospitalId = session.user.hospitalId;

    const [appointmentsData, setAppointmentsData] = useState<PatientCountPerMonth[]>(mockAppointmentsData["2023"]); // test code
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        // Uncomment this section to fetch real data

        // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // const getAppointments = () => {
        //     try {
        //         const filteredAppointments = role !== "SUPER_ADMIN" && hospitalId
        //             ? appointments.filter(app => app.hospitalId === hospitalId)
        //             : appointments;
    
        //         // Initialize all months with a count of 0
        //         const initialData: PatientCountPerMonth[] = months.map(month => ({
        //             month,
        //             count: 0,
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
        //             count: uniquePatientsByMonth[data.month]?.size || 0,
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
        <div className="grid p-4 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
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
                    <Tooltip />
                    <Legend align="right" />
                    <Bar
                        dataKey="count"
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
