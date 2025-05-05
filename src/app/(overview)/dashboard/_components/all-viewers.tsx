"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartData = [
  { platform: "online", viewers: 1260, fill: "var(--color-chart-1)" },
];

const chartConfig = {
  viewers: {
    label: "viewers",
  },
  online: {
    label: "Online",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AllViewers() {
  return (
    <Card className="flex h-full flex-col shadow-none">
      <CardHeader className="items-center">
        <CardTitle>All Viewers</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="h-full flex-1">
        <ChartContainer config={chartConfig} className="">
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={90}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-secondary last:fill-background"
              polarRadius={[96, 84]}
            />
            <RadialBar dataKey="viewers" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-5xl font-bold"
                        >
                          {chartData[0].viewers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 34}
                          className="fill-muted-foreground"
                        >
                          Viwers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total viewers of all your events for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
