"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", ussd: 222, online: 150 },
  { date: "2024-04-02", ussd: 97, online: 180 },
  { date: "2024-04-03", ussd: 167, online: 120 },
  { date: "2024-04-04", ussd: 242, online: 260 },
  { date: "2024-04-05", ussd: 373, online: 290 },
  { date: "2024-04-06", ussd: 301, online: 340 },
  { date: "2024-04-07", ussd: 245, online: 180 },
  { date: "2024-04-08", ussd: 409, online: 320 },
  { date: "2024-04-09", ussd: 59, online: 110 },
  { date: "2024-04-10", ussd: 261, online: 190 },
  { date: "2024-04-11", ussd: 327, online: 350 },
  { date: "2024-04-12", ussd: 292, online: 210 },
  { date: "2024-04-13", ussd: 342, online: 380 },
  { date: "2024-04-14", ussd: 137, online: 220 },
  { date: "2024-04-15", ussd: 120, online: 170 },
  { date: "2024-04-16", ussd: 138, online: 190 },
  { date: "2024-04-17", ussd: 446, online: 360 },
  { date: "2024-04-18", ussd: 364, online: 410 },
  { date: "2024-04-19", ussd: 243, online: 180 },
  { date: "2024-04-20", ussd: 89, online: 150 },
  { date: "2024-04-21", ussd: 137, online: 200 },
  { date: "2024-04-22", ussd: 224, online: 170 },
  { date: "2024-04-23", ussd: 138, online: 230 },
  { date: "2024-04-24", ussd: 387, online: 290 },
  { date: "2024-04-25", ussd: 215, online: 250 },
  { date: "2024-04-26", ussd: 75, online: 130 },
  { date: "2024-04-27", ussd: 383, online: 420 },
  { date: "2024-04-28", ussd: 122, online: 180 },
  { date: "2024-04-29", ussd: 315, online: 240 },
  { date: "2024-04-30", ussd: 454, online: 380 },
  { date: "2024-05-01", ussd: 165, online: 220 },
  { date: "2024-05-02", ussd: 293, online: 310 },
  { date: "2024-05-03", ussd: 247, online: 190 },
  { date: "2024-05-04", ussd: 385, online: 420 },
  { date: "2024-05-05", ussd: 481, online: 390 },
  { date: "2024-05-06", ussd: 498, online: 520 },
  { date: "2024-05-07", ussd: 388, online: 300 },
  { date: "2024-05-08", ussd: 149, online: 210 },
  { date: "2024-05-09", ussd: 227, online: 180 },
  { date: "2024-05-10", ussd: 293, online: 330 },
  { date: "2024-05-11", ussd: 335, online: 270 },
  { date: "2024-05-12", ussd: 197, online: 240 },
  { date: "2024-05-13", ussd: 197, online: 160 },
  { date: "2024-05-14", ussd: 448, online: 490 },
  { date: "2024-05-15", ussd: 473, online: 380 },
  { date: "2024-05-16", ussd: 338, online: 400 },
  { date: "2024-05-17", ussd: 499, online: 420 },
  { date: "2024-05-18", ussd: 315, online: 350 },
  { date: "2024-05-19", ussd: 235, online: 180 },
  { date: "2024-05-20", ussd: 177, online: 230 },
  { date: "2024-05-21", ussd: 82, online: 140 },
  { date: "2024-05-22", ussd: 81, online: 120 },
  { date: "2024-05-23", ussd: 252, online: 290 },
  { date: "2024-05-24", ussd: 294, online: 220 },
  { date: "2024-05-25", ussd: 201, online: 250 },
  { date: "2024-05-26", ussd: 213, online: 170 },
  { date: "2024-05-27", ussd: 420, online: 460 },
  { date: "2024-05-28", ussd: 233, online: 190 },
  { date: "2024-05-29", ussd: 78, online: 130 },
  { date: "2024-05-30", ussd: 340, online: 280 },
  { date: "2024-05-31", ussd: 178, online: 230 },
  { date: "2024-06-01", ussd: 178, online: 200 },
  { date: "2024-06-02", ussd: 470, online: 410 },
  { date: "2024-06-03", ussd: 103, online: 160 },
  { date: "2024-06-04", ussd: 439, online: 380 },
  { date: "2024-06-05", ussd: 88, online: 140 },
  { date: "2024-06-06", ussd: 294, online: 250 },
  { date: "2024-06-07", ussd: 323, online: 370 },
  { date: "2024-06-08", ussd: 385, online: 320 },
  { date: "2024-06-09", ussd: 438, online: 480 },
  { date: "2024-06-10", ussd: 155, online: 200 },
  { date: "2024-06-11", ussd: 92, online: 150 },
  { date: "2024-06-12", ussd: 492, online: 420 },
  { date: "2024-06-13", ussd: 81, online: 130 },
  { date: "2024-06-14", ussd: 426, online: 380 },
  { date: "2024-06-15", ussd: 307, online: 350 },
  { date: "2024-06-16", ussd: 371, online: 310 },
  { date: "2024-06-17", ussd: 475, online: 520 },
  { date: "2024-06-18", ussd: 107, online: 170 },
  { date: "2024-06-19", ussd: 341, online: 290 },
  { date: "2024-06-20", ussd: 408, online: 450 },
  { date: "2024-06-21", ussd: 169, online: 210 },
  { date: "2024-06-22", ussd: 317, online: 270 },
  { date: "2024-06-23", ussd: 480, online: 530 },
  { date: "2024-06-24", ussd: 132, online: 180 },
  { date: "2024-06-25", ussd: 141, online: 190 },
  { date: "2024-06-26", ussd: 434, online: 380 },
  { date: "2024-06-27", ussd: 448, online: 490 },
  { date: "2024-06-28", ussd: 149, online: 200 },
  { date: "2024-06-29", ussd: 103, online: 160 },
  { date: "2024-06-30", ussd: 446, online: 400 },
];

const chartConfig = {
  visitors: {
    label: "Voters",
  },
  ussd: {
    label: "USSD",
    color: "var(--chart-1)",
  },
  online: {
    label: "Online",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function VotingPlatformChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card shadow-none">
      <CardHeader>
        <CardTitle>Platforms</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Voting platforms for all events.
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 text-xs **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d" className="text-xs">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="text-xs">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillussd" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ussd)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ussd)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillonline" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-online)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-online)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="online"
              type="natural"
              fill="url(#fillonline)"
              stroke="var(--color-online)"
              stackId="a"
            />
            <Area
              dataKey="ussd"
              type="natural"
              fill="url(#fillussd)"
              stroke="var(--color-ussd)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
