import { SectionCards } from "@/components/section-cards";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "./data.json";
import { DataTable } from "./_components/data-table";

export type AllEvents = {
  id: number;
  name: string;
  description: string;
  image: string;
  voting_period: {
    start: string;
    end: string;
  };
  nomination_period: {
    start: string;
    end: string;
  };
  approvalStatus: "pending" | "approved" | "declined";
  eventProgress: "ongoing" | "not started" | "completed";
  categories: number;
  isPublished: boolean;
  displayResults: boolean;
};

const cardsData = [
  {
    title: "All events",
    value: "4",
    description: "All events created",
  },
  {
    title: "Ongoing events",
    value: "3",
    description: "Published events still ongoing",
  },
  {
    title: "Completed events",
    value: "1",
    description: "All past events",
  },
];

export default function EventsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6">
        <section className="mb-10 flex items-center justify-between">
          <section className="">
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              All events
            </h1>
            <p className="text-gray-500">Manage all your events</p>
          </section>
          <section>
            <Button>
              Create new event
              <PlusIcon />
            </Button>
          </section>
        </section>
        <SectionCards data={cardsData} />
      </div>
      <div className="w-full">
        <DataTable data={data as AllEvents[]} />
      </div>
    </div>
  );
}
