// File: src/components/dashboard/AvailableBedsCard.tsx

"use client"

import React, { useEffect, useState } from 'react';
import { fetchAvailableBeds } from '@/lib/data';

const AvailableBedsCard = () => {
    const [availableBeds, setAvailableBeds] = useState(0);

    useEffect(() => {
        const fetchBeds = async () => {
            const beds = await fetchAvailableBeds();
            setAvailableBeds(beds.length);
        };

        fetchBeds();
    }, []);

    return (
        <div className="card">
            <h3>Available Beds</h3>
            <p>{availableBeds} Beds Available</p>
        </div>
    );
};

export default AvailableBedsCard;

