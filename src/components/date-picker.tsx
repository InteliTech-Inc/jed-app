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

export default function DatePicker({ defaultValue }: { defaultValue: string }) {
  const [date, setDate] = React.useState<Date>(new Date(defaultValue));

  return (
    <Popover>
      <PopoverTrigger asChild className="!pl-3">
        <Button
          variant={"outline"}
          className={cn(
            "h-9 w-full justify-start px-0 text-left font-normal shadow-none",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon />
          {date ? format(date, "MMM d, yyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-white p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => setDate(value as Date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
