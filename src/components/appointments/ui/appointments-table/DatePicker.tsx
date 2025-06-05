// src/components/appointments/ui/appointments-table/DatePicker.tsx

"use client";

import * as React from "react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function DatePicker({
    onDateChange,
}: {
    onDateChange: (date: Date | undefined) => void;
}) {
    const [date, setDate] = React.useState<Date>();
    const [selectedDate, setSelectedDate] = React.useState<string>("");

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        setSelectedDate(newDate ? format(newDate, "PPP") : "");
        onDateChange(newDate);
    };

    const handleSelectDateChange = (value: string) => {
        let newDate: Date | undefined;
        switch (value) {
            case "0":
                newDate = new Date();
                break;
            case "1":
                newDate = subDays(new Date(), 1);
                break;
            case "7":
                newDate = subWeeks(new Date(), 1);
                break;
            case "30":
                newDate = subMonths(new Date(), 1);
                break;
            default:
                newDate = undefined;
                break;
        }
        handleDateChange(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[90px] h-[50px] justify-start text-left font-normal rounded-[10px] shadow-lg shadow-gray-400 hover:bg-primary hover:text-white hover:shadow-gray-400",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarCheck className="pr-1 h-6 w-6" />
                    <span className="font-bold">Date</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto mt-2 rounded-[10px] flex-col space-y-2 p-2 shadow-sm shadow-primary">
                <Select onValueChange={handleSelectDateChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Yesterday</SelectItem>
                        <SelectItem value="7">A week ago</SelectItem>
                        <SelectItem value="30">A month ago</SelectItem>
                    </SelectContent>
                </Select>
                {selectedDate && (
                    <div className="mb-2 mt-2 m-auto justify-center border p-2 rounded-[10px] bg-bluelight">
                        Selected Date:
                        <span className="font-bold"> {selectedDate}</span>
                    </div>
                )}
                <div className="rounded-[10px]">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
