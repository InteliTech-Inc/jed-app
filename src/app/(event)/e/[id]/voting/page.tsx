import { Spinner } from "@/components/spinner";
import { Suspense } from "react";
import { allEvents } from "@/app/(overview)/events/page";
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

export default async function VotingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // In the actual implementation, take this computation out of the component

  const votingData = allEvents
    .filter((event) => event.id === parseInt(id))
    .flatMap((event) => {
      return event.categoryDetails.flatMap((category) => {
        return category.nominees.map((nominee) => {
          return {
            id: parseInt(nominee.id),
            full_name: nominee.fullName,
            email:
              nominee.fullName.split(" ")[0].toLowerCase() + "@example.com",
            phone: nominee.fullName.split(" ")[1],
            votes: nominee.totalVotes,
            category: category.name,
            code: nominee.code,
            photo:
              nominee.image || `https://i.pravatar.cc/150?img=${nominee.id}`, // Use image field or generate placeholder
          };
        });
      });
    });

  if (!votingData) {
    return <div>Event not found</div>;
  }

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
          <VotingDataTable data={votingData} />
        </Suspense>
      </div>
    </section>
  );
}
