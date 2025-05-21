import { authAxios } from "@/providers/api-client";
import { CreateEventCategoriesModal } from "./_components/create-categories-modal";
import EventDetails from "./_components/event-details";

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const response = await authAxios.get(`/events/${id}`);
  const event = response.data.data;
  return {
    title: `${event.name} | Event Management`,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/e/${event.id}`,
      siteName: "JED",
      images: [
        {
          url: event.image,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.name,
      description: event.description,
      images: [event.image],
    },
  };
}

export const revalidate = 0;
export default async function SingleEventPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  return (
    <section className="mx-auto min-h-screen max-w-7xl p-6">
      <header className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex max-w-lg flex-col items-start gap-2">
          <p className="mb-2 text-4xl font-semibold text-neutral-700">Event</p>
          <p className="text-neutral-600">
            Manage the nominees for this event. You can filter by category,
            search by name, and edit or delete nominees as needed.
          </p>
        </div>
        <CreateEventCategoriesModal />
      </header>
      <EventDetails />
    </section>
  );
}
