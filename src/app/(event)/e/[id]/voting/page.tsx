import { Spinner } from "@/components/spinner";
import { Suspense } from "react";
import { VotingDataTable } from "./_components/data-table";

export type VotingDataResponse = {
  id: number;
  full_name: string;
  email?: string;
  phone?: string;
  code: string;
  votes: number;
  category: string;
  photo: string;
};

export default async function VotingPage() {
  return (
    <section className="h-full p-4">
      <section className="mb-4 max-w-screen-sm">
        <p className="mb-2 text-4xl font-semibold text-neutral-700">Voting</p>
        <p className="text-neutral-600">
          Track the progress of the voting period. You can filter the data and
          download the voting results.
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
          <VotingDataTable />
        </Suspense>
      </div>
    </section>
  );
}
