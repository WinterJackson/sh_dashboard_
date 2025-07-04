// src/components/ui/hospital-combobox.tsx

"use client";

import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { Hospital } from "@/lib/definitions";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface HospitalComboboxProps {
    hospitals: Hospital[];
    selectedHospitalId?: number | null;
    isLoading: boolean;
    defaultLabel?: string;
    className?: string;
    onSelectHospitalId?: (id: number | null) => void;
    popoverWidthClass?: string;
}

export function HospitalCombobox({
    hospitals,
    selectedHospitalId = -1,
    isLoading,
    defaultLabel = "Select Hospital",
    className,
    onSelectHospitalId,
    popoverWidthClass,
}: HospitalComboboxProps) {
    const [open, setOpen] = useState(false);
    const [displayValue, setDisplayValue] = useState(defaultLabel);
    const [searchText, setSearchText] = useState<string>("");
    const listRef = useRef<HTMLDivElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const selectedHospital = useMemo(() => {
        return hospitals.find((h) => h.hospitalId === selectedHospitalId);
    }, [hospitals, selectedHospitalId]);

    const filteredHospitals = useMemo(() => {
        if (!searchText) return hospitals;
        return hospitals.filter((h) =>
            h.hospitalName.toLowerCase().includes(searchText.toLowerCase())
        );
    }, [hospitals, searchText]);

    const handleSelect = (id: number | null) => {
        setSearchText("");
        setOpen(false);
        setHighlightedIndex(-1);

        if (id === null) {
            setDisplayValue(defaultLabel);
        } else {
            const selected = hospitals.find((h) => h.hospitalId === id);
            setDisplayValue(selected?.hospitalName || defaultLabel);
        }
        onSelectHospitalId?.(id);
    };

    const handleOpenChange = (openState: boolean) => {
        setOpen(openState);
        if (!openState) {
            setSearchText("");
            setHighlightedIndex(-1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                Math.min(prev + 1, filteredHospitals.length - 1)
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && highlightedIndex >= 0) {
            const selected = filteredHospitals[highlightedIndex];
            handleSelect(selected.hospitalId);
        }
    };

    useEffect(() => {
        if (listRef.current && highlightedIndex >= 0) {
            const items = listRef.current.querySelectorAll('[role="option"]');
            const el = items[highlightedIndex] as HTMLElement;
            el?.scrollIntoView({ block: "nearest" });
        }
    }, [highlightedIndex]);

    return (
        <div className="w-full max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="destructive"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between h-10 px-3 py-2 text-xs sm:text-sm font-normal",
                            "bg-background text-text-main rounded-[10px]",
                            "hover:bg-background-muted/80 overflow-hidden text-ellipsis whitespace-nowrap",
                            className
                        )}
                    >
                        {isLoading ? (
                            <Skeleton className="h-4 w-full" />
                        ) : selectedHospital ? (
                            <span className="truncate">{displayValue}</span>
                        ) : (
                            <span className="text-text-main truncate">
                                {defaultLabel}
                            </span>
                        )}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-70" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    side="bottom"
                    align="start"
                    className={cn(
                        popoverWidthClass ?? "w-full sm:w-[370px]",
                        "p-1 rounded-[10px] border border-border bg-card"
                    )}
                >
                    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
                        <CommandInput
                            placeholder="Search hospital..."
                            value={searchText}
                            onValueChange={setSearchText}
                            className="h-8 text-xs sm:text-sm"
                        />
                        <CommandList
                            className="max-h-[400px] overflow-y-auto scrollbar-custom"
                            ref={listRef}
                        >
                            <CommandEmpty className="py-3 px-4 text-xs sm:text-sm text-text-muted">
                                No hospitals found
                            </CommandEmpty>
                            <CommandGroup>
                                <CommandItem
                                    key="select"
                                    value=""
                                    onSelect={() => handleSelect(null)}
                                    aria-selected={selectedHospitalId === null}
                                    className="cursor-pointer px-4 py-2 text-xs sm:text-sm hover:bg-background-muted/80"
                                >
                                    <CheckIcon
                                        className={cn(
                                            "h-4 w-4",
                                            selectedHospitalId === null
                                                ? "opacity-100 text-primary"
                                                : "opacity-0"
                                        )}
                                    />
                                    <span className="truncate text-text-muted">
                                        {defaultLabel}
                                    </span>
                                </CommandItem>
                                {[...filteredHospitals]
                                    .sort((a, b) =>
                                        a.hospitalName.localeCompare(
                                            b.hospitalName
                                        )
                                    )
                                    .map((hospital, index) => (
                                        <CommandItem
                                            key={hospital.hospitalId}
                                            value={hospital.hospitalId.toString()}
                                            onSelect={() =>
                                                handleSelect(
                                                    hospital.hospitalId
                                                )
                                            }
                                            className={cn(
                                                "cursor-pointer px-4 py-2 text-xs sm:text-sm",
                                                highlightedIndex === index
                                                    ? "bg-primary text-primary-foreground"
                                                    : "hover:bg-primary hover:text-primary-foreground"
                                            )}
                                            role="option"
                                            aria-selected={
                                                selectedHospitalId ===
                                                hospital.hospitalId
                                            }
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "h-4 w-4",
                                                    selectedHospitalId ===
                                                        hospital.hospitalId
                                                        ? "opacity-100 text-primary"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <span className="truncate">
                                                {hospital.hospitalName}
                                            </span>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
