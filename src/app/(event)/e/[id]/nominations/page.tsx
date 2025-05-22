import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { NominationsTable } from "./_components/data-table";

export type NominationsResponse = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  reasons: string;
  created_at: string;
  event_id: string;
  category_id?: string;
  category: {
    id: string;
    name: string;
  };
};

export default async function NominationsPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  return (
    <section className="h-full p-4">
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
          <NominationsTable />
        </Suspense>
      </div>
    </section>
  );
}
