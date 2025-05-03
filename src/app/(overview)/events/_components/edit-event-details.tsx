"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AllEvents } from "../page";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker() {
  const [date, setDate] = React.useState<Date>();

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
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default function EditEventDetails({ data }: { data: AllEvents }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto text-sm">
      <div className="max-h-[20rem] min-h-[15rem] w-full">
        <Image
          src={data.image}
          alt="equipment details"
          width={1000}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      <form className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={data.name} />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="description">Description</Label>
          <Input id="description" defaultValue={data.description} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="target">Voting start</Label>
            <DatePicker />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="limit">Voting end</Label>
            <DatePicker />
          </div>
        </div>
      </form>
    </div>
  );
}
