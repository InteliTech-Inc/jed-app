"use client";
import { Button } from "@/components/ui/button";
import Illustration from "@/assets/404_illustration.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen mt-10 md:mt-0 md:p-6 grid gap-6 md:grid-cols-2 items-center h-full">
      <div className="w-full p-4 px-8 ">
        <div className=" space-y-4">
          <h1 className=" mt-2 text-3xl md:text-5xl font-bold text-primary">Ooops! We lost this page.</h1>
          <p className=" text-lg">We can't seem to find the page you're looking for because it looks like it does not exist.</p>
          <p className=" mt-2 "> Here are some helpful links instead</p>
        </div>
        <div className="text-primary flex flex-col gap-2 items-start md:flex-row">
          <Button onClick={() => router.back()} variant={"link"} className="underline pl-0 py-2 transition-all ease duration-100">
            Back
          </Button>
          <Button onClick={() => router.push("/")} variant={"link"} className="underline pl-0 py-2 transition-all ease duration-100">
            Dashboard
          </Button>
          <Button onClick={() => router.push("/events")} variant={"link"} className="underline pl-0 py-2 transition-all ease duration-100">
            Events
          </Button>
        </div>
      </div>
      <div className=" w-full h-[35rem] ">
        <Image src={Illustration} alt="404 Illustration" className="w-full h-full" priority />
      </div>
    </div>
  );
}
