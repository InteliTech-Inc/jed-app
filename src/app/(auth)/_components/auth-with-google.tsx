"use client";
import React from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { setToken } from "@/helpers/get-token";
import { useRouter } from "next/navigation";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { formatJedError } from "@/lib/utils";

type AuthWithGoogleProps =
  | "continue_with"
  | "signin_with"
  | "signup_with"
  | "signin"
  | undefined;

export default function AuthWithGoogle({
  text,
}: Readonly<{
  text: AuthWithGoogleProps;
}>) {
  const { authWithGoogle } = QUERY_FUNCTIONS;
  const router = useRouter();

  const handleCredentialResponse = async (
    credentialResponse: CredentialResponse,
  ) => {
    const id_token = credentialResponse.credential;

    if (!id_token) {
      console.error("No ID token returned");
      return;
    }

    try {
      const { data } = await authWithGoogle(id_token);
      if (data) {
        const { accessToken } = data;
        setToken(accessToken);
        toast.success("Welcome back to JED!");
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(formatJedError(err));
      }
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <GoogleLogin
      shape="circle"
      text={text}
      size="large"
      width={"386px"}
      ux_mode="popup"
      logo_alignment="center"
      useOneTap
      itp_support
      locale="en"
      onSuccess={handleCredentialResponse}
      onError={() => {
        toast.error("Login failed");
      }}
    />
  );
}
