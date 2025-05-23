"use client";

import { IconDashboard, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { MAIN_NAV_ITEMS } from "@/constants/nav-links";
import { usePathname, useParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";

const mainNavItems = {
  title: "Main",
  icon: IconDashboard,
  items: [...MAIN_NAV_ITEMS.navMain, ...MAIN_NAV_ITEMS.navSecondary],
};

export function EventNavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const { id } = useParams();
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const { toggleSidebar, isMobile } = useSidebar();

  const isActive = (href: string) => {
    const activeLink = lastSegment === id ? "details" : lastSegment;
    return activeLink === href;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={`/e/${id}/${item.url === "details" ? "" : item.url}`}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                  isActive={isActive(item.url)}
                  className=" "
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {/* Main Navigation */}
          <Collapsible
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={mainNavItems.title}>
                  <mainNavItems.icon />
                  <span>{mainNavItems.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {mainNavItems.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
