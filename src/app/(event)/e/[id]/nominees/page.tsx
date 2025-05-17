import { Spinner } from "@/components/spinner";
import { Suspense } from "react";
import { NomineesDataTable } from "./_components/data-table";

export default function NomineesPage() {
  return (
    <section className="h-full p-4">
      <section className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-screen-sm">
          <p className="mb-2 text-4xl font-semibold text-neutral-700">
            Nominees
          </p>
          <p className="text-neutral-600">
            Manage the nominees for this event. You can filter by category,
            search by name, and edit or delete nominees as needed.
          </p>
        </div>
      </section>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid w-full place-content-center">
              <Spinner />
            </div>
          }
        >
          <NomineesDataTable />
        </Suspense>
      </div>
    </section>
  );
}
