import { CreateEventForm } from "./_components/create-event-form";

export default function NewEventPage() {
  return (
    <section className="mx-auto h-full max-w-2xl p-4 py-6">
      <div className="mb-6 max-w-screen-sm">
        <p className="mb-2 text-4xl font-semibold text-neutral-700">
          Create New Event
        </p>
        <p className="mt-4 text-neutral-600">
          Complete the form below to create a new event.
        </p>
      </div>

      <div className="mt-8">
        <CreateEventForm />
      </div>
    </section>
  );
}
