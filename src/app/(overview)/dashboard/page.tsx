import { VotingPlatformChart } from "@/app/(overview)/dashboard/_components/voting-platform-chart";
import { SectionCards } from "@/components/section-cards";
import Viewers from "./_components/viewers";
import getUserFromServer, { fetchEvents } from "@/lib/functions/server";
import { EventResponse } from "@/interfaces/event";
import { transformToLowerCase } from "@/lib/utils";
import { CARDS_DATA_2 } from "@/lib/data/cards-data";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Event Management",
  },
  description:
    "Event Organizers dashboard for viewing events statistics, earnings, and more.",
};

export default async function DashboardPage() {
  const {
    data: { first_name },
  } = await getUserFromServer();

  const { data } = await fetchEvents();

  const ongoingEvents = data.events.filter(
    (event: EventResponse) =>
      transformToLowerCase(event.event_progress) === "ongoing",
  );

  const dashboardStatistics = CARDS_DATA_2.map((card) => {
    switch (card.title) {
      case "Ongoing Events":
        return {
          ...card,
          value: ongoingEvents.length,
        };
      case "Total Revenue":
        return {
          ...card,
          value: "GHC 1,250.00",
        };
      case "Available Balance":
        return {
          ...card,
          value: "GHC 950.00",
        };
      default:
        return card;
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <section className="mb-10">
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              Welcome, {first_name} 👋
            </h1>
            <p className="text-gray-500">
              Here's what's happening with your account today.
            </p>
          </section>
          <SectionCards data={dashboardStatistics} />
          <div className="">
            <VotingPlatformChart />
          </div>
          <div>
            <Viewers />
          </div>
        </div>
      </div>
    </div>
  );
}
