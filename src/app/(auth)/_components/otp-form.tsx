"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { API_URL } from "@/constants/url";
import axios, { AxiosError } from "axios";
import { COOKIE_NAME } from "@/constants/url";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import { formatJedError } from "@/lib/utils";
import { useState } from "react";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export default function InputOTPForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function onSubmit(payload: z.infer<typeof FormSchema>) {
    if (!email) {
      toast.error("Invalid email. Please try again.");
      router.push("/sign-up");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(`${API_URL}/auth/verify-account`, {
        email,
        token: payload.pin,
      });

      if (!response.data) {
        toast.error("Invalid email or password. Please try again.");
      }

      if (response.data) {
        const { accessToken } = response.data.data;
        Cookies.set(COOKIE_NAME, accessToken);
        toast.success("Welcome back to JED!");
        router.push("/login");
        form.reset();
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
        return;
      }
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid w-full place-content-center space-y-6 p-4"
      >
        <section className="mb-10 grid w-full">
          <h1 className="text-2xl font-bold">Verify your email</h1>
          <FormDescription>
            Please enter the one-time password (OTP) sent to your email.
          </FormDescription>
        </section>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password (OTP)</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4">
          {isLoading ? <Spinner /> : "Verify"}
        </Button>

        <div className="text-muted-foreground *:[a]:hover:text-primary mt-4 text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
          By clicking verify, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
      </form>
    </Form>
  );
}
