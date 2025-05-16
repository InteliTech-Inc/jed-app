import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { format } from "date-fns";

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
};

export default function DatePicker({
  value,
  onChange,
}: Readonly<DatePickerProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild className="!pl-3">
        <Button
          variant={"outline"}
          className={cn(
            "h-9 w-full justify-start px-0 text-left font-normal shadow-none",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {value ? format(value, "MMM d, yyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
