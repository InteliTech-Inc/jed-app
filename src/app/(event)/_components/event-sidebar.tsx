"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
} from "@tabler/icons-react";
import { EventNavMain } from "@/app/(event)/_components/event-nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useUser } from "@/hooks/use-user";

const data = {
  navMain: [
    {
      title: "Details",
      url: "details",
      icon: IconDashboard,
    },
    {
      title: "Nominees",
      url: "nominees",
      icon: IconListDetails,
    },
    {
      title: "Voting",
      url: "voting",
      icon: IconChartBar,
    },
    {
      title: "Nominations",
      url: "nominations",
      icon: IconFolder,
    },
  ],
};

export function SingleEventSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size={"lg"}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <EventNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  );
}
