import Image from "next/image";
import EmptyStateImage from "@/assets/empty-state-illustration.png";

export function NoNominations({ eventName }: Readonly<{ eventName: string }>) {
  return (
    <div className="my-auto grid h-fit w-full place-items-center">
      <section className="h-48 w-full">
        <Image
          src={EmptyStateImage}
          alt="No nominations found"
          width={1000}
          height={1000}
          className="h-full w-full object-contain"
        />
      </section>
      <p className="text-2xl font-semibold text-gray-800">
        No nominations found
      </p>
      <p className="mt-4 max-w-md text-center text-neutral-500">
        The event {eventName} does not have any nominations from the public yet.
      </p>
    </div>
  );
}
