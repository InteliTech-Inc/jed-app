"use client";
import { cn, formatJedError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LoginImage from "@/assets/green_chair.jpeg";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginFormSchema } from "@/validations/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Spinner } from "@/components/spinner";
import axios, { AxiosError } from "axios";
import { API_URL } from "@/constants/url";
import { setToken } from "@/helpers/get-token";
import AuthWithGoogle from "./auth-with-google";
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(payload: z.infer<typeof loginFormSchema>) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, payload);

      if (!response.data) {
        toast.error("Invalid email or password. Please try again.");
      }

      if (response.data) {
        const { accessToken } = response.data.data;
        setToken(accessToken);
        toast.success("Welcome back to JED!");
        router.push("/dashboard");
        form.reset();
      }
    } catch (error: unknown) {
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
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your JED account
                </p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="evans@topboy.com"
                  className={`py-5 ${form.formState.errors.email ? "border-red-500" : ""}`}
                  {...form.register("email")}
                  autoComplete="on"
                />
                {form.formState.errors.email && (
                  <small className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </small>
                )}
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  className={`py-5 ${form.formState.errors.password ? "border-red-500" : ""}`}
                  placeholder="********"
                  autoComplete="on"
                  autoCorrect="off"
                  aria-label="Password"
                  aria-describedby="password"
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
                className="inline-flex w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : "Login"}
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or
                </span>
              </div>
              <div className="gap-4">
                <AuthWithGoogle text={"continue_with"} />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up
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
          <div className="bg-primary relative hidden h-screen lg:block">
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
