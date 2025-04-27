"use client";

import * as React from "react";
import { IconChartBar, IconDashboard, IconFolder, IconHelp, IconListDetails, IconSearch, IconSettings } from "@tabler/icons-react";
import { Logo } from "@/components/logo";

import { NavMain } from "@/app/(overview)/_components/nav-main";
import { NavSecondary } from "@/app/(overview)/_components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export const MAIN_NAV_ITEMS = {
  user: {
    name: "Jed Events",
    email: "jed@jedevents.com",
    avatar: "/avatars/jed.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Events",
      url: "/events",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: IconChartBar,
    },
    {
      title: "Tickets",
      url: "/tickets",
      icon: IconFolder,
    },
  ],
  navSecondary: [
    {
      title: "Tutorials",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Contact",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size={"lg"} className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <Logo />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <NavMain items={MAIN_NAV_ITEMS.navMain} />
        <NavSecondary items={MAIN_NAV_ITEMS.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MAIN_NAV_ITEMS.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
