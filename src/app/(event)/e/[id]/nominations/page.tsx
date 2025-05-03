import { allEvents } from "@/app/(overview)/events/page";
import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import nominations from "./data.json";
import { NominationsTable } from "./_components/data-table";

export type NominationsResponse = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  reasons: string;
  created_at: string;
  event_id: number;
  categories: {
    id: string;
    name: string;
  };
};

export default async function NominationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = allEvents.find((event) => event.id === parseInt(id));

  if (!event) {
    redirect("/not-found");
  }

  const results: NominationsResponse[] = nominations.filter(
    (n) => n.event_id === parseInt(id),
  );

  return (
    <section className="h-full">
      <section className="mb-4 max-w-screen-sm">
        <p className="mb-2 text-4xl font-semibold text-neutral-700">
          Nominations
        </p>
        <p className="text-neutral-600">
          View and manage nominations. You can copy the link of the nominations
          forms for this event and download the nominations results.
        </p>
      </section>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid w-full place-content-center">
              <Spinner />
            </div>
          }
        >
          <NominationsTable data={results} id={event.id} />
        </Suspense>
      </div>
    </section>
  );
}
