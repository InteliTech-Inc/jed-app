import type { Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-client";

import "./globals.css";
import { NetworkProvider } from "@/providers/network";
import GoogleAuthProvider from "@/providers/google-auth";

export const viewport: Viewport = {
  themeColor: "#fff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const switzer = localFont({
  src: [
    {
      path: "../../public/fonts/Outfit-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Outfit-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Outfit-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Outfit-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Outfit-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-paragraph",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${switzer.variable} ${satoshi.variable} antialiased`}>
        <GoogleAuthProvider>
          <NetworkProvider>
            <QueryProvider>
              <Toaster
                closeButton
                className="font-(family-name:--font-paragraph)"
                position="top-center"
                richColors
              />
              <div className="relative">{children}</div>
            </QueryProvider>
          </NetworkProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
