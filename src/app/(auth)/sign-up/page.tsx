import { Metadata } from "next";
import { SignUpForm } from "../_components/sign-up-form";

export const metadata: Metadata = {
  title: "Sign up | Event Management",
  description: "Sign up for your account to access your dashboard.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
