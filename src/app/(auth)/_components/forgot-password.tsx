import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LoginImage from "@/assets/green_chair.jpeg";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-none rounded-none">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 grid place-content-center h-screen md:h-fit md:p-8 self-center w-full mx-auto">
            <div className="flex  flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground text-balance">Enter your email to reset your password</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required className=" py-5" />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log In
                </a>
              </div>
            </div>
          </form>
          <div className="bg-primary h-screen relative hidden md:block">
            <Image src={LoginImage} alt="Image" className="absolute inset-0 h-full w-full object-cover " />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
