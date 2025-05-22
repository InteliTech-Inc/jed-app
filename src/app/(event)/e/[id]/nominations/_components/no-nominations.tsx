import Image from "next/image";
import EmptyStateImage from "@/assets/empty-state-illustration.png";

export function NoNominations() {
  return (
    <div className="my-auto grid h-fit w-full place-items-center">
      <section className="h-36 w-full">
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
      <p className="mt-1 mb-4 max-w-md text-center text-neutral-500">
        This event does not have any nominations from the public yet.
      </p>
    </div>
  );
}
