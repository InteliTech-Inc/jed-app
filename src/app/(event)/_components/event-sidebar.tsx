"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFolder,
  IconListDetails,
} from "@tabler/icons-react";
import { Logo } from "@/components/logo";
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

const data = {
  user: {
    id: "1",
    first_name: "Jed",
    last_name: "Events",
    email: "jed@jedevents.com",
    avatar: "/avatars/jed.png",
  },
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

    // {
    //   title: "Analytics",
    //   url: "/analytics",
    //   icon: IconChartBar,
    // },
  ],
};

export function SingleEventSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size={"lg"}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              {/* <a href="#">
                <Logo />
              </a> */}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="mt-4">
        <EventNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
