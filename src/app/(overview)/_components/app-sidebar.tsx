"use client";

import * as React from "react";
import { NavMain } from "@/app/(overview)/_components/nav-main";
import { NavSecondary } from "@/app/(overview)/_components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { MAIN_NAV_ITEMS } from "@/constants/nav-links";
import { Logo } from "@/components/logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className=" mt-2">
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MAIN_NAV_ITEMS.navMain} />
        <NavSecondary items={MAIN_NAV_ITEMS.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={MAIN_NAV_ITEMS.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
