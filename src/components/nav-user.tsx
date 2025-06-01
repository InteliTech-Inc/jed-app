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
import { toast } from "sonner";
import Link from "next/link";
import { User } from "@/hooks/use-user";
import { authAxios } from "@/providers/api-client";
import { AxiosError } from "axios";
import { formatJedError } from "@/lib/utils";
import { clearToken } from "@/helpers/get-token";

export function NavUser({ user }: { readonly user: User }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await authAxios.post("/auth/logout");
      if (res.data) {
        console.log(res.data.data.message);
        toast.success(res.data.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(formatJedError(error));
      }
    } finally {
      clearToken();
      const redirectUrl = process.env.NEXT_PUBLIC_LIVE_URL as string;
      router.push(redirectUrl);
    }
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
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage
                  src={user?.media?.url}
                  alt={`${user?.first_name} ${user?.last_name}`}
                  className="aspect-square object-cover object-center"
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
                <Avatar className="h-6 w-6 rounded-full">
                  <AvatarImage
                    src={user?.media?.url}
                    alt={`${user?.first_name} ${user?.last_name}`}
                    className="aspect-square object-cover object-center"
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
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex cursor-pointer items-center gap-2"
              >
                <IconUserCircle />
                Account
              </Link>
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
