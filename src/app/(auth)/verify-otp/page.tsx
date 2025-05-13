import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import InputOTPForm from "../_components/otp-form";
import LoginImage from "@/assets/green_chair.jpeg";
import Image from "next/image";
import { Suspense } from "react";

export default function VerifyOtpPage() {
  return (
    <div className="h-screen">
      <div className={cn("flex flex-col gap-6")}>
        <Card className="overflow-hidden rounded-none border-none p-0 shadow-none">
          <CardContent className="grid h-screen place-content-center p-0 md:grid-cols-2">
            <Suspense>
              <InputOTPForm />
            </Suspense>
            <div className="bg-primary relative hidden h-screen md:block">
              <div className="absolute inset-0 z-10 bg-black/50" />
              <Image
                src={LoginImage}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
