import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SingleEventSidebar } from "./_components/event-sidebar";
export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SingleEventSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
