// src/components/ui/search.tsx

"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useSearch } from "@/app/context/SearchContext";

export default function Search({ placeholder = "Search" }: { placeholder: string }) {
    const { searchTerm, setSearchTerm } = useSearch();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term) => {
        setSearchTerm(term);
        const params = new URLSearchParams();
        if (term) {
            params.set("query", term);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    return (
        <div className="w-1/2 ml-4 flex items-center bg-gray-100 p-2 rounded-2xl">
            <label htmlFor="search" className="sr-only">Search</label>
            <input
                type="text"
                placeholder={placeholder}
                className="ml-2 bg-gray-100 outline-none"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}

