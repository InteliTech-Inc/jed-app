"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { AllEvents } from "../page";
import * as React from "react";
import DatePicker from "@/components/date-picker";

export default function EditEventDetails({ data }: { data: AllEvents }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
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
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-5 p-4"
      >
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
            <DatePicker defaultValue={data.voting_period.start} />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="limit">Voting end</Label>
            <DatePicker defaultValue={data.voting_period.end} />
          </div>
        </div>
        {data.nomination_period && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="target">Nomination start</Label>
              <DatePicker defaultValue={data.nomination_period.start} />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="limit">Nomination end</Label>
              <DatePicker defaultValue={data.nomination_period.end} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
