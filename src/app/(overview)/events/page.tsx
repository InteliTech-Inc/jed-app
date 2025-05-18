import { SectionCards } from "@/components/section-cards";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EmptyStateImage from "@/assets/empty-state-illustration.png";
import data from "./data.json";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { fetchEvents } from "@/lib/functions/server";
import { EventResponse } from "@/interfaces/event";
import { EventProgress } from "@/types/event-status";
import { CARDS_DATA } from "@/lib/data/cards-data";
import { transformToLowerCase } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: {
    default: "Events",
    template: "%s | Event Management",
  },
  description:
    "Event management dashboard for managing events,reading statistics data, and interacting with events and many more.",
};

export default async function EventsPage() {
  const { data: allEvents } = await fetchEvents();

  console.log(allEvents);
  function filterEvents(events: EventResponse[], status: EventProgress) {
    return events.filter(
      (event: EventResponse) =>
        transformToLowerCase(event.event_progress) === status,
    );
  }

  const eventStatistics = CARDS_DATA.map((card) => {
    switch (card.title) {
      case "All events":
        return {
          ...card,
          value: allEvents.events.length,
        };
      case "Ongoing events":
        return {
          ...card,
          value: filterEvents(allEvents.events, "ongoing").length,
        };
      case "Completed events":
        return {
          ...card,
          value: filterEvents(allEvents.events, "completed").length,
        };
      default:
        return card;
    }
  });

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
          <Button asChild>
            <Link href="/events/new">
              Create new event
              <PlusIcon />
            </Link>
          </Button>
        </section>
      </section>
      {allEvents.events.length > 0 ? (
        <>
          <div className="flex flex-col gap-4 py-4 md:gap-6">
            <SectionCards data={eventStatistics} />
          </div>
          <div className="w-full">
            <DataTable />
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

export { data as allEvents };
