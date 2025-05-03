"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { NominationsResponse } from "../page";
import * as React from "react";

export default function NominationDetailsPanel({
  data,
}: {
  data: NominationsResponse;
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="flex flex-col gap-4 overflow-y-auto text-sm">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-5 p-4"
      >
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue={data.full_name} />
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={data.email} />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" defaultValue={data.phone} />
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="limit">Reasons</Label>
          <p>{data.reasons}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="limit">Category</Label>
          <p>{data.categories.name}</p>
        </div>
      </form>
    </div>
  );
}
