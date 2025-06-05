// src/app/(auth)/sign-up/loading.tsx

"use client"

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const LoadingSpinner = () => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    if (!isBrowser) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] pointer-events-none">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>,
        document.body
    );
};

export default LoadingSpinner;
