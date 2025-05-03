import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardsData = Record<"title" | "value" | "description", string>[];

export function SectionCards({ data }: { data: CardsData }) {
  return (
    <div className="*:data-[slot=card]:from-accent/20 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:via-white *:data-[slot=card]:to-white *:data-[slot=card]:shadow-none @xl/main:grid-cols-2 @3xl/main:grid-cols-3">
      {data.map((data) => {
        return (
          <Card key={data.title} className="@container/card">
            <CardHeader>
              <CardDescription>{data.title}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {data.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="text-muted-foreground">{data.description}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
