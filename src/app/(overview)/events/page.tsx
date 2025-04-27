import Link from "next/link";

import { Button } from "@/components/ui/button";

const events = [
  {
    id: 1,
    name: "Event 1",
    description: "Event 1 description",
  },
  {
    id: 2,
    name: "Event 2",
    description: "Event 2 description",
  },
];

export default function EventsPage() {
  return (
    <div>
      <h1>Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id}>
            <h2>{event.name}</h2>
            <p>{event.description}</p>
            <Button>
              <Link href={`/e/${event.id}`}>View</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
