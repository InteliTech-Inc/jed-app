import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";
import Viewers from "./_components/viewers";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <SectionCards />
          <div className="">
            <ChartAreaInteractive />
          </div>
          <div>
            <Viewers />
          </div>
        </div>
      </div>
    </div>
  );
}
