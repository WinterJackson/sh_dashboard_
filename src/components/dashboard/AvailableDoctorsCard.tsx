// File: src/components/dashboard/AvailableDoctorsCard.tsx

"use client"

import React, { useEffect, useState } from 'react';
import { fetchOnlineDoctors } from '@/lib/data';

const AvailableDoctorsCard = () => {
    const [availableDoctors, setAvailableDoctors] = useState(0);

    useEffect(() => {
        const fetchDoctors = async () => {
            const doctors = await fetchOnlineDoctors();
            setAvailableDoctors(doctors.length);
        };

        fetchDoctors();
    }, []);

    return (
        <div className="card">
            <h3>Available Doctors</h3>
            <p>{availableDoctors} Currently Online</p>
        </div>
    );
};

export default AvailableDoctorsCard;

