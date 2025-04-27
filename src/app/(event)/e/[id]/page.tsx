export default function SingleEventPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Single event page</h1>
      <p>Params: {params.id}</p>
    </div>
  );
}
