import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isActive = (href: string, pathname: string) => {
  if (pathname !== "/" && href === "/") {
    return false;
  }
  return pathname?.startsWith(href);
};
