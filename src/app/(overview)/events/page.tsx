import { SectionCards } from "@/components/section-cards";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EmptyStateImage from "@/assets/empty-state-illustration.png";
import data from "./data.json";

// const data: AllEvents[] = [];
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
      {data.length > 0 ? (
        <>
          <div className="flex flex-col gap-4 py-4 md:gap-6">
            <SectionCards data={cardsData} />
          </div>
          <div className="w-full">
            <DataTable data={data as AllEvents[]} />
          </div>
        </>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <section className="h-48 w-full">
            <Image
              src={EmptyStateImage}
              alt="No events found"
              width={1000}
              height={1000}
              className="h-full w-full object-contain"
            />
          </section>
          <p className="text-2xl font-semibold text-gray-800">
            No events found
          </p>
          <p className="mt-4 max-w-md text-center text-neutral-500">
            You haven't created any events yet. Start by creating your first
            event to get things rolling!
          </p>
        </div>
      )}
    </div>
  );
}
