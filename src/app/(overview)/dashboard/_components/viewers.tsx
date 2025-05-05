import { Card } from "@/components/ui/card";
import { MonthlyViewers } from "./monthly-viewers";
import { AllViewers } from "./all-viewers";

export default function Viewers() {
  return (
    <div className="flex flex-row gap-6">
      <div className="w-full">
        <AllViewers />
      </div>
      <div className="w-full">
        <MonthlyViewers />
      </div>
    </div>
  );
}
