"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { COOKIE_NAME } from "@/constants/url";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function NavUser({
  user,
}: Readonly<{
  user: {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
}>) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  function handleLogout() {
    Cookies.remove(COOKIE_NAME);
    router.push("/login");
    toast.success("You have been logged out successfully");
  }

  function extractUserInitials(full_name: string) {
    const names = full_name.split(" ");
    return names.map((name) => name.charAt(0).toUpperCase()).join("");
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-primary data-[state=open]:text-sidebar-accent-foreground p-0 px-2"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar}
                  alt={`${user?.first_name} ${user?.last_name}`}
                />
                <AvatarFallback className="">
                  {extractUserInitials(
                    user?.first_name + " " + user?.last_name,
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-2" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-6 w-6 rounded-lg">
                  <AvatarImage
                    src={user?.avatar}
                    alt={`${user?.first_name} ${user?.last_name}`}
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    {extractUserInitials(
                      user?.first_name + " " + user?.last_name,
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconUserCircle />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
