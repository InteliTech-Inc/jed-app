import React from "react";

export default function InfoCards({ data }: { readonly data: any }) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {data.map((card: any) => (
        <div
          key={card.title}
          className="from-accent/20 item-start flex flex-col gap-3.5 rounded-xl bg-gradient-to-t via-white to-white p-6 text-white shadow-sm"
        >
          <h3 className="text-muted-foreground text-sm">{card.title}</h3>
          <p className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {card.value}
          </p>
          <p className="text-muted-foreground text-sm">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
