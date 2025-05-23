"use client";

import { type Icon } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { isActive } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function NavMain({
  items,
}: Readonly<{
  items: {
    title: string;
    url: string;
    icon?: Icon;
    badge?: string;
  }[];
}>) {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <SidebarGroup className="mt-4">
      <SidebarGroupContent className="">
        <SidebarMenu className="gap-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="">
              <Link href={item.url}>
                <SidebarMenuButton
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar();
                    }
                  }}
                  tooltip={item.title}
                  isActive={isActive(item.url, pathname)}
                  className="flex items-center"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-accent text-secondary ml-auto py-0 opacity-50"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
