// src/components/hospitals/ui/hospitals-table/HospitalsFilters.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Hospital, KEPHLevel, HospitalOwnershipType } from "@/lib/definitions";
import { useSearch } from "@/app/context/SearchContext";
import { ChevronRight, CircleX as CancelledIcon } from "lucide-react";
import { SymbolIcon } from "@radix-ui/react-icons";

interface HospitalsFiltersProps {
    hospitals: Hospital[];
    onFilterChange: (filteredHospitals: Hospital[]) => void;
    onSetHospitals: (hospitals: Hospital[]) => void;
}

const HospitalsFilters: React.FC<HospitalsFiltersProps> = ({
    hospitals,
    onFilterChange,
    onSetHospitals,
}) => {
    const { searchTerm, setSearchTerm } = useSearch();
    const [filterType, setFilterType] = useState("Filter By");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
    const [selectedKephLevel, setSelectedKephLevel] =
        useState<KEPHLevel | null>(null);
    const [selectedHospitalType, setSelectedHospitalType] =
        useState<HospitalOwnershipType | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    // Helper function to get unique values from hospitals
    const getUniqueValues = (key: keyof Hospital) => {
        return Array.from(
            new Set(hospitals.map((h) => h[key]).filter(Boolean) as string[])
        ).sort();
    };

    // Get unique counties, kephLevels, and hospitalTypes
    const counties = useMemo(() => getUniqueValues("county"), [hospitals]);
    const kephLevels = useMemo(() => Object.values(KEPHLevel), []);
    const ownershipTypes = useMemo(() => Object.values(HospitalOwnershipType), []);

    // Clear individual filters
    const clearCountyFilter = () => setSelectedCounty(null);
    const clearKephLevelFilter = () => setSelectedKephLevel(null);
    const clearHospitalTypeFilter = () => setSelectedHospitalType(null);

    // Active filters to display as tags
    const activeFilters = useMemo(() => {
        const filters = [];
        if (selectedCounty)
            filters.push({
                label: `County: ${selectedCounty}`,
                onClear: clearCountyFilter,
            });
        if (selectedKephLevel)
            filters.push({
                label: `KEPH: ${selectedKephLevel}`,
                onClear: clearKephLevelFilter,
            });
        if (selectedHospitalType)
            filters.push({
                label: `Type: ${selectedHospitalType}`,
                onClear: clearHospitalTypeFilter,
            });

        return filters;
    }, [selectedCounty, selectedKephLevel, selectedHospitalType]);

    // Filtered hospitals based on active filters and search
    const filteredHospitals = useMemo(() => {
        return hospitals.filter((hospital) => {
            // Text-based filters
            if (searchTerm && filterType !== "Filter By") {
                const term = searchTerm.toLowerCase();
                switch (filterType) {
                    case "Name":
                        if (!hospital.hospitalName.toLowerCase().includes(term))
                            return false;
                        break;
                    case "ID":
                        if (!hospital.hospitalId.toString().includes(term))
                            return false;
                        break;
                    case "Phone":
                        if (hospital.phone && !hospital.phone.includes(term))
                            return false;
                        break;
                    case "Email":
                        if (
                            hospital.email &&
                            !hospital.email.toLowerCase().includes(term)
                        )
                            return false;
                        break;
                    case "Referral Code":
                        if (
                            hospital.referralCode &&
                            !hospital.referralCode.toLowerCase().includes(term)
                        )
                            return false;
                        break;
                }
            }

            // Specific filters
            if (selectedCounty && hospital.county !== selectedCounty)
                return false;
            if (selectedKephLevel && hospital.kephLevel !== selectedKephLevel)
                return false;
            if (
                selectedHospitalType &&
                hospital.ownershipType !== selectedHospitalType
            )
                return false;

            return true;
        });
    }, [
        hospitals,
        searchTerm,
        filterType,
        selectedCounty,
        selectedKephLevel,
        selectedHospitalType,
    ]);

    // Update filtered hospitals when filters change
    useEffect(() => {
        onFilterChange(filteredHospitals);
    }, [filteredHospitals, onFilterChange]);

    // Handle filter type selection
    const handleFilterSelection = (type: string) => {
        setFilterType(type);
        setSearchTerm("");
        clearCountyFilter();
        clearKephLevelFilter();
        clearHospitalTypeFilter();
    };

    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        setSearchTerm("");
    };

    const handleCountySelect = (county: string) => {
        setSelectedCounty(county);
        setSearchTerm("");
    };

    const handleKephLevelSelect = (level: KEPHLevel) => {
        setSelectedKephLevel(level);
        setSearchTerm("");
    };

    const handleHospitalTypeSelect = (type: HospitalOwnershipType) => {
        setSelectedHospitalType(type);
        setSearchTerm("");
    };

    // Refresh all filters and reload data
    const handleRefreshClick = () => {
        setFilterType("Filter By");
        clearCountyFilter();
        clearKephLevelFilter();
        clearHospitalTypeFilter();
        setSearchTerm("");
        onSetHospitals(hospitals);
    };

    // Get KEPH level label
    const getKephLevelLabel = (level: KEPHLevel) => {
        const labels: Record<KEPHLevel, string> = {
            LEVEL_1: "Level 1 - Community",
            LEVEL_2: "Level 2 - Primary Care",
            LEVEL_3: "Level 3 - Sub-County",
            LEVEL_4: "Level 4 - County Referral",
            LEVEL_5: "Level 5 - National Referral",
        };
        return labels[level] || level;
    };

    return (
        <div className="flex flex-col min-w-full mb-3">
            <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                    onClick={handleRefreshClick}
                    className="p-2 rounded-[10px] h-[50px] w-[120px] gap-2 hover:shadow-shadow-main shadow-md shadow-shadow-main text-foreground hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between"
                >
                    Refresh
                    <SymbolIcon className="w-5 h-5" />
                </button>

                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-light-accent text-accent-foreground p-2 rounded-[10px] h-[40px] w-auto gap-2 hover:shadow-shadow-main shadow-md shadow-shadow-main hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
                        >
                            <span className="font-normal text-sm">
                                {filter.label}
                            </span>
                            <button
                                onClick={filter.onClear}
                                className="flex items-center justify-center p-[2px] bg-background rounded-full"
                            >
                                <CancelledIcon className="h-5 w-5 text-center text-red-500 hover:text-white hover:bg-red-500 rounded-full" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 pt-0 pl-0 flex flex-row justify-between items-center mt-3">
                <div className="flex flex-row items-center gap-4">
                    {/* Dropdown Menu for Filters */}
                    <DropdownMenu onOpenChange={setShowOptions}>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none focus:ring-1 focus:ring-primary flex items-center gap-2 p-2 rounded-[10px] h-[50px] hover:shadow-shadow-main shadow-md shadow-shadow-main justify-between w-[200px]">
                                {filterType || "Filter By"}
                                <ChevronRight
                                    className={`ml-auto text-xl transform transition-transform ${
                                        showOptions ? "rotate-90" : ""
                                    }`}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className="bg-background rounded-[10px] p-2 w-[200px] mt-1">
                                {/* County Filter */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        County
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-background rounded-[10px] shadow p-3 ml-4 max-h-60 overflow-y-auto">
                                        {counties.map((county) => (
                                            <DropdownMenuItem
                                                key={county}
                                                onClick={() =>
                                                    handleCountySelect(county)
                                                }
                                            >
                                                {county}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* KEPH Level Filter */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        KEPH Level
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-background rounded-[10px] shadow p-3 ml-4">
                                        {kephLevels.map((level) => (
                                            <DropdownMenuItem
                                                key={level}
                                                onClick={() =>
                                                    handleKephLevelSelect(level)
                                                }
                                            >
                                                {getKephLevelLabel(level)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* Hospital Type Filter */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Hospital Type
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-background rounded-[10px] shadow p-3 ml-4">
                                        {ownershipTypes.map((type) => (
                                            <DropdownMenuItem
                                                key={type}
                                                onClick={() =>
                                                    handleHospitalTypeSelect(
                                                        type
                                                    )
                                                }
                                            >
                                                {type}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* Text-based Filters */}
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Name")
                                    }
                                >
                                    Name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleFilterSelection("ID")}
                                >
                                    ID
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Phone")
                                    }
                                >
                                    Phone
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Email")
                                    }
                                >
                                    Email
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Referral Code")
                                    }
                                >
                                    Referral Code
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default HospitalsFilters;
