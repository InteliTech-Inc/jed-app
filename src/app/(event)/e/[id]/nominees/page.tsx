import { Spinner } from "@/components/spinner";
import { Suspense } from "react";
import { NomineesDataTable } from "./_components/data-table";
import { Nominee } from "./_components/columns";

// Dummy data for nominees
const dummyNominees: Nominee[] = [
  {
    id: "1",
    fullName: "John Smith",
    category: "Best Actor",
    photo: "https://i.pravatar.cc/150?img=1",
    code: "AC01",
    totalVotes: 125,
  },
  {
    id: "2",
    fullName: "Emma Johnson",
    category: "Best Actress",
    photo: "https://i.pravatar.cc/150?img=5",
    code: "AC02",
    totalVotes: 142,
  },
  {
    id: "3",
    fullName: "Michael Williams",
    category: "Best Actor",
    photo: "https://i.pravatar.cc/150?img=3",
    code: "AC03",
    totalVotes: 98,
  },
  {
    id: "4",
    fullName: "Sophia Brown",
    category: "Best Actress",
    photo: "https://i.pravatar.cc/150?img=9",
    code: "AC04",
    totalVotes: 113,
  },
  {
    id: "5",
    fullName: "Daniel Jones",
    category: "Best Supporting Actor",
    photo: "https://i.pravatar.cc/150?img=4",
    code: "SU05",
    totalVotes: 87,
  },
  {
    id: "6",
    fullName: "Olivia Davis",
    category: "Best Supporting Actress",
    photo: "https://i.pravatar.cc/150?img=8",
    code: "SU06",
    totalVotes: 92,
  },
  {
    id: "7",
    fullName: "Robert Miller",
    category: "Best Supporting Actor",
    photo: "https://i.pravatar.cc/150?img=7",
    code: "SU07",
    totalVotes: 76,
  },
  {
    id: "8",
    fullName: "Ava Wilson",
    category: "Best Supporting Actress",
    photo: "https://i.pravatar.cc/150?img=2",
    code: "SU08",
    totalVotes: 81,
  },
  {
    id: "9",
    fullName: "James Taylor",
    category: "Best Director",
    photo: "https://i.pravatar.cc/150?img=11",
    code: "DI01",
    totalVotes: 156,
  },
  {
    id: "10",
    fullName: "Charlotte Anderson",
    category: "Best Director",
    photo: "https://i.pravatar.cc/150?img=10",
    code: "DI02",
    totalVotes: 143,
  },
  {
    id: "11",
    fullName: "Thomas White",
    category: "Best Screenplay",
    photo: "https://i.pravatar.cc/150?img=12",
    code: "SC01",
    totalVotes: 112,
  },
  {
    id: "12",
    fullName: "Isabella Clark",
    category: "Best Screenplay",
    photo: "https://i.pravatar.cc/150?img=19",
    code: "SC02",
    totalVotes: 103,
  },
];

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
          <NomineesDataTable data={dummyNominees} />
        </Suspense>
      </div>
    </section>
  );
}
