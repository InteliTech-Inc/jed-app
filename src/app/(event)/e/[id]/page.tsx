export default async function SingleEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Single event page</h1>
      <p>Params: {id}</p>
    </div>
  );
}
