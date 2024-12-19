// src/app/api-viewer/page.tsx

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { JSONTree } from "react-json-tree";
import LoadingSpinner from "@/components/ui/loading";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.png";

// Theme styling
const theme = {
    base00: "#1e1e1e", // Dark mode background
    base07: "#d4d4d4", // Default text color
    base08: "#d16969", // Error color (red)
    base0B: "#b5cea8", // Boolean (true/false)
    base0D: "#9cdcfe", // Keys
    base0E: "#c586c0", // Strings
    base09: "#ce9178", // Numbers
    tree: {
        backgroundColor: "#12294E",
        fontFamily: "Menlo, monospace",
        fontSize: "15px",
        padding: "20px",
        borderRadius: "20px",
        margin: "15px",
    },
};

const ApiViewerContent = () => {
    const searchParams = useSearchParams();
    const path = searchParams.get("path");

    const [data, setData] = useState<Object | any[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (path) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.API_URL}/${path}`
                    );
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                    const json = await response.json();
                    setData(json);
                    setError(null);
                } catch (err: any) {
                    setError(err.message);
                    setData(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [path]);

    if (!path) {
        return (
            <p>
                Please provide an API path in the query parameter (e.g.,
                ?path=doctors).
            </p>
        );
    }

    if (loading) return <LoadingSpinner />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="m-6 shadow-lg shadow-gray-300 fixed top-2 left-0 w-[300px] h-[95%] bg-bluelight rounded-2xl p-4 flex flex-col items-center">
                <div className="bg-secondary p-4 mb-8 w-[300px] h-[80px] flex">
                    {/* Logo Image */}
                    <Link href="/api-landing">
                        <Image
                            src={logo}
                            alt="SnarkHealth Logo"
                            width={120}
                            height={80}
                            className="cursor-pointer mb-4"
                            loading="lazy"
                        />
                    </Link>
                </div>
                <h1 className="font-bold text-3xl text-secondary mb-4">
                    SnarkHealth API
                </h1>
                <p className="ml-4 mt-4 font-semibold">
                    Displaying data from <code>/api/{path}</code>:
                </p>
                <p className="mt-auto font-semibold text-secondary">
                    Version 1.0
                </p>
            </div>

            {/* Main Content */}
            <div className="ml-[320px] flex-1 p-4 overflow-y-auto">
                {data ? (
                    <JSONTree
                        data={data}
                        theme={theme}
                        invertTheme={false}
                    />
                ) : (
                    <p className="bg-[#1e1e1e] font-[15px] p-[20px] rounded-[20px] m-[15px]">
                        No data available.
                    </p>
                )}
            </div>
        </div>
    );
};

const ApiViewer = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ApiViewerContent />
        </Suspense>
    );
};

export default ApiViewer;
