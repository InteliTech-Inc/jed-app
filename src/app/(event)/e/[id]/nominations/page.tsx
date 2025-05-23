import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { NominationsTable } from "./_components/data-table";
import { authAxios } from "@/providers/api-client";

export type NominationsResponse = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  reasons: string;
  created_at: string;
  event_id: string;
  category_id?: string;
  category: {
    id: string;
    name: string;
  };
};

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const response = await authAxios.get(`/events/${id}`);
  const event = response.data.data;
  return {
    title: `${event.name} | Event Nominations`,
    description: event.description,
    openGraph: {
      title: event.name,
      description: event.description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/e/${event.id}/nominations`,
      siteName: "JED",
      images: [
        {
          url: event.media.url,
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
      images: [event.media.url],
    },
  };
}

export const revalidate = 0;

export default async function NominationsPage() {
  return (
    <section className="h-full p-4">
      <section className="mb-4 max-w-screen-sm">
        <p className="mb-2 text-4xl font-semibold text-neutral-700">
          Nominations
        </p>
        <p className="text-neutral-600">
          View and manage nominations. You can copy the link of the nominations
          forms for this event and download the nominations results.
        </p>
      </section>

      <div className="mt-10">
        <Suspense
          fallback={
            <div className="grid w-full place-content-center">
              <Spinner />
            </div>
          }
        >
          <NominationsTable />
        </Suspense>
      </div>
    </section>
  );
}
