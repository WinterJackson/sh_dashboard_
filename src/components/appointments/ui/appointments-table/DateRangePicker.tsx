// src/components/appointments/ui/appointments-table/DateRangePicker.tsx

"use client";

import React from "react";
import { addDays, format } from "date-fns";
import { CalendarRange } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function DateRangePicker({
    onDateRangeChange,
}: {
    onDateRangeChange: (range: DateRange | undefined) => void;
}) {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });

    const handleDateRangeChange = (newRange: DateRange | undefined) => {
        setDateRange(newRange);
        onDateRangeChange(newRange);
    };

    const formattedDateRange =
        dateRange?.from && dateRange?.to
            ? `${format(dateRange.from, "LLL dd, y")} - ${format(
                  dateRange.to,
                  "LLL dd, y"
              )}`
            : "Range"; // Display "Range" if no dates selected

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                        "w-[105px] h-[50px] justify-start text-left font-normal rounded-[10px] shadow-lg shadow-gray-400 hover:bg-primary hover:text-white hover:shadow-gray-400",
                        !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarRange className="pr-1 h-6 w-6" />
                    <span className="font-bold">Range</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="grid w-auto p-2 mt-2 rounded-[10px] shadow-sm shadow-primary" align="end">
                <div className="mb-2 mt-2 m-auto justify-center border p-2 rounded-[10px] bg-bluelight">
                    Selected Range:{" "}
                    <span className="font-bold">{formattedDateRange}</span>
                </div>
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
