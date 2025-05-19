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
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="mx-auto grid h-screen max-w-lg place-content-center self-center p-6 md:h-fit md:p-8"
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
                  Or continue with
                </span>
              </div>
              <div className="gap-4">
                <Button variant="outline" type="button" className="w-full">
                  <svg
                    viewBox="-3 0 262 262"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        fill="#4285F4"
                      ></path>
                      <path
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        fill="#34A853"
                      ></path>
                      <path
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        fill="#FBBC05"
                      ></path>
                      <path
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        fill="#EB4335"
                      ></path>
                    </g>
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
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
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </div>
          </form>
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
  );
}
