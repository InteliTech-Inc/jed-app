import { authAxios } from "@/providers/api-client";

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

export default async function SingleEventPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  return (
    <div>
      <h1>Single event page</h1>
      <p>Params: {id}</p>
    </div>
  );
}
