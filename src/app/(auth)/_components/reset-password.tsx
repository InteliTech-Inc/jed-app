"use client";
import { cn, formatJedError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import LoginImage from "@/assets/green_chair.jpeg";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/spinner";
import { authAxios } from "@/providers/api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { resetPasswordSchema } from "@/validations/reset-password";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("e") ?? "";
  const tokenFromUrl = searchParams.get("t") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      token: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setValue("email", emailFromUrl);
    setValue("token", tokenFromUrl);
  }, [emailFromUrl, tokenFromUrl, setValue]);

  async function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    const { email, token, password } = data;
    try {
      const res = await authAxios.post("/auth/reset-password", {
        email,
        token,
        new_password: password,
      });
      if (res.data.status === "success") {
        toast.success(res.data.data.message ?? "Password reset successfully!");
        router.push("/login");
        reset();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden rounded-none border-none p-0 shadow-none">
        <CardContent className="grid p-0 lg:grid-cols-2">
          <form
            className="mx-auto grid h-screen w-full place-content-center self-center p-6 md:p-8 lg:h-fit"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex w-full flex-col gap-6 sm:w-[25rem]">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Reset Your Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your new password below
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="py-5"
                  {...register("email")}
                  disabled={true}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="py-5 pr-10"
                    {...register("password")}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="py-5 pr-10"
                    {...register("confirmPassword")}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Reset Password"}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Log In
                </a>
              </div>
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
