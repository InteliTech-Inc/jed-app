"use client";

import * as React from "react";
import {
  useCreateEventStore,
  EventTools,
} from "@/lib/stores/create-event-store";
import { IconCheck, IconTicket, IconUserSearch } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const tools = [
  {
    id: "nominations",
    name: "Nominations",
    description: "Allows you to create a nominations forms for your event.",
    icon: IconUserSearch,
  },
  {
    id: "voting",
    name: "Voting",
    description: "Enable voting for nominees across different categories.",
    icon: IconCheck,
  },
  // {
  //   id: "ticketing",
  //   name: "Ticketing",
  //   description: "Sell tickets for physical or virtual events.",
  //   icon: IconTicket,
  // },
];

export function EventToolsStep() {
  const { tools: selectedTools, updateTools } = useCreateEventStore();

  const handleToolToggle = (tool: keyof EventTools) => {
    updateTools({
      ...selectedTools,
      [tool]: !selectedTools[tool],
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {tools.map((tool) => {
          const id = tool.id as keyof EventTools;
          const isSelected = selectedTools[id];

          return (
            <Card
              key={tool.id}
              className={`cursor-pointer shadow-none transition-all ${
                isSelected ? "bg-accent border-accent" : ""
              }`}
              onClick={() => handleToolToggle(id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={`mt-2 text-lg font-medium ${
                      isSelected ? "text-secondary" : ""
                    }`}
                  >
                    {tool.name}
                  </CardTitle>
                  <Switch
                    checked={isSelected}
                    className="data-[state=checked]:bg-secondary"
                    onCheckedChange={() => handleToolToggle(id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription
                  className={`${isSelected ? "text-secondary opacity-90" : ""}`}
                >
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <small>
        *You can set or customize the dates for each tool you select later on
        the events page.
      </small>
    </div>
  );
}
