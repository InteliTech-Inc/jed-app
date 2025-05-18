import { AppSidebar } from "@/app/(overview)/_components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Overview",
    template: "%s | Event Management",
  },
  description:
    "Event management dashboard for managing events, users, and more.",
  openGraph: {
    title: "Overview",
    description:
      "Event management dashboard for managing events, users, and more.",
    url: "/overview",
    siteName: "Event Management",
  },
  twitter: {
    card: "summary_large_image",
    title: "Overview",
    description:
      "Event management dashboard for managing events, users, and more.",
  },
};

export default function OverviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
