import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleAuthProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
