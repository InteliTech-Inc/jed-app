import { LoginForm } from "@/app/(auth)/_components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Event Management",
  description: "Login to your account to access your dashboard.",
};

export default function LoginPage() {
  return (
    <div className="">
      <LoginForm className="h-screen" />
    </div>
  );
}
