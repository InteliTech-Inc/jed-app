import { VotingPlatformChart } from "@/app/(overview)/dashboard/_components/voting-platform-chart";
import { SectionCards } from "@/components/section-cards";
import Viewers from "./_components/viewers";

const cardData = [
  {
    title: "Ongoing Events",
    value: "2",
    description: "Updated after every event publish.",
  },
  {
    title: "Total Revenue",
    value: "GHC 1,250.00",
    description: "Earnings from all events",
  },
  {
    title: "Withdrawable Earnings",
    value: "GHC 950.00",
    description: "Total withdrawable amount",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <section className="mb-10">
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">
              Welcome, Trump 👋
            </h1>
            <p className="text-gray-500">
              Here's what's happening with your account today.
            </p>
          </section>
          <SectionCards data={cardData} />
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
