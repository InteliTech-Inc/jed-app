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

export const exportToCSV = <T extends Record<string, string | number>>(
  data: T[],
  filename: string,
): void => {
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map(
          (header) =>
            `"${(row[header] as string | number)
              .toString()
              .replace(/"/g, '""')}"`,
        )
        .join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8",
  });

  // Create a hidden anchor element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Intl.DateTimeFormat("en-GB").format(new Date())}__JED`;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
