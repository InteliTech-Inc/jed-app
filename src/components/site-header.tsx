import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { HomeIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="ml-auto flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="hidden w-fit rounded-full sm:flex"
          >
            <a
              href={`${process.env.NEXT_PUBLIC_LANDING_PAGE_URL}`}
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              <HomeIcon />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
