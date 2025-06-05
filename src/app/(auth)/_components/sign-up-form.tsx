"use client";
import { cn, formatJedError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LoginImage from "@/assets/green_chair.jpeg";
import { signUpFormSchema } from "@/validations/schema";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/constants/url";
import { PhoneInput } from "@/components/phone-input";
import { Value as PhoneValue } from "react-phone-number-input";
import AuthWithGoogle from "./auth-with-google";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone_number: "" as PhoneValue,
    },
  });

  async function onSubmit(payload: z.infer<typeof signUpFormSchema>) {
    const { fullName, email, password, phone_number } = payload;

    const [first_name, ...rest] = fullName.split(" ");

    const payloadData = {
      first_name,
      last_name: rest.join(" "),
      email,
      password,
      phone_number,
    };

    console.log("Payload Data:", payloadData);

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        payloadData,
      );

      if (!response.data) {
        toast.error("Account creation failed");
        return;
      }

      if (response.data) {
        const searchParams = new URLSearchParams({ email });
        toast.success(
          "We have sent you an OTP to your email to verify your account",
        );
        router.push(`/verify-otp?${searchParams.toString()}`);
        form.reset();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
        return;
      }
      toast.error("Something went wrong");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-none border-none p-0 shadow-none">
        <CardContent className="grid p-0 lg:grid-cols-2">
          <form
            className="mx-auto grid h-screen max-w-lg place-content-center self-center p-6 md:p-8 lg:h-fit"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome to JED</h1>
                <p className="text-muted-foreground text-balance">
                  Create an account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Joshua Owusu"
                  className={`py-5 ${form.formState.errors.fullName ? "border-red-500" : ""}`}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="on"
                  spellCheck="true"
                  {...form.register("fullName")}
                />
                {form.formState.errors.fullName && (
                  <small className="text-sm text-red-500">
                    {form.formState.errors.fullName.message}
                  </small>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone_number">Phone Number</Label>
                <PhoneInput
                  id="phone_number"
                  placeholder="Enter phone number"
                  defaultCountry="GH"
                  international
                  {...form.register("phone_number")}
                  onChange={(value) =>
                    form.setValue("phone_number", value ?? ("" as PhoneValue))
                  }
                  className={` ${form.formState.errors.phone_number ? "border-red-500" : ""}`}
                  disabled={form.formState.isSubmitting}
                />
                {form.formState.errors.phone_number && (
                  <small className="text-sm text-red-500">
                    {form.formState.errors.phone_number.message}
                  </small>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="evans@topboy.com"
                  className={`py-5 ${form.formState.errors.email ? "border-red-500" : ""}`}
                  autoComplete="on"
                  autoCorrect="off"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <small className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </small>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  placeholder="************"
                  type="password"
                  className={`py-5 ${form.formState.errors.password ? "border-red-500" : ""}`}
                  autoComplete="off"
                  autoCorrect="off"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <small className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </small>
                )}
              </div>
              <Button
                type="submit"
                className="inline-flex w-full select-none disabled:!cursor-not-allowed"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  " Create Account"
                )}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="gap-4">
                <AuthWithGoogle text={"signup_with"} />
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log In
                </a>
              </div>
            </div>
            <div className="text-muted-foreground *:[a]:hover:text-primary mt-4 text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our{" "}
              <a
                href="https://jedevent.com/legal/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="https://jedevent.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </div>
          </form>
          <div className="bg-primary relative hidden min-h-screen lg:block">
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
  );
}
