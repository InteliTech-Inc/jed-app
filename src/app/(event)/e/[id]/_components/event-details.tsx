"use client";
import { Spinner } from "@/components/spinner";
import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import InfoCards from "./info-card";
import { DataTable } from "./categories-table";
import { EventResponse, Vote } from "@/interfaces/event";
import Image from "next/image";
import { useEventStore } from "@/lib/stores/event-store";

const cardsData = [
  {
    title: "Total Votes Cast",
    description: "Total votes cast for this event",
  },
  {
    title: "Total Revenue",
    description: "Total revenue generated for this event",
  },
  {
    title: "Withdrawable Earnings",
    description: "Withdrawable earnings for this event",
  },
];

export default function EventDetails() {
  const { id: event_id } = useParams();
  const { fetchEvent } = QUERY_FUNCTIONS;

  const { eventDetails, setEventDetails, setCategories, categories } =
    useEventStore();

  const { data: event, isLoading } = useQuery<{ data: EventResponse }>({
    queryKey: [QUERY_KEYS.EVENTS, event_id],
    queryFn: () => fetchEvent(event_id as string),
    enabled: !!event_id,
  });

  useEffect(() => {
    if (event) {
      setEventDetails(event.data);
      setCategories(event.data.categories);
    }
  }, [event]);

  if (isLoading || !eventDetails) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  function calculateTotalRevenue(votes: Vote[]): number {
    return (
      votes?.map((vote) => vote.amount).reduce((acc, curr) => acc + curr, 0) /
      100
    );
  }

  function calculateWithdrawableEarnings(votes: Vote[]) {
    const totalRevenue = calculateTotalRevenue(votes);
    const serviceFee = eventDetails?.service_percentage
      ? eventDetails.service_percentage / 100
      : 0;
    const withdrawableEarnings = totalRevenue - totalRevenue * serviceFee;
    return withdrawableEarnings.toFixed(2);
  }

  const eventStatistics = cardsData.map((card) => {
    switch (card.title) {
      case "Total Votes Cast":
        return {
          ...card,
          value: eventDetails?.votes?.length,
        };
      case "Total Revenue":
        return {
          ...card,
          value: `GHC ${calculateTotalRevenue(eventDetails?.votes)?.toFixed(2)}`,
        };
      case "Withdrawable Earnings":
        return {
          ...card,
          value: `GHC ${calculateWithdrawableEarnings(eventDetails?.votes)}`,
        };
      default:
        return card;
    }
  });

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="relative h-[23rem] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="absolute inset-0 z-0">
            <Image
              src={eventDetails?.media?.url}
              alt={eventDetails?.name}
              className="h-full w-full object-cover"
              width={1000}
              height={1000}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>

          <div className="absolute bottom-0 z-10 w-full p-6 text-white">
            <h2 className="mb-1 text-2xl font-semibold">
              {eventDetails?.name}
            </h2>
            <p className="max-w-lg text-sm text-neutral-300">
              {eventDetails?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-center">
            <div className="relative mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full border-4 border-dashed border-teal-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {categories?.length}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600">
              Total categories for this event
            </p>
          </div>
        </div>
      </div>
      <InfoCards data={eventStatistics} />
      <DataTable />
    </>
  );
}
