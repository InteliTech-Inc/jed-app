import { AxiosError } from "axios";
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

export const generateCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars.charAt(randomIndex);
  }

  return result;
};

export const exportToCSV = <
  T extends Record<string, string | number | boolean | object>,
>(
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
              ?.toString()
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

export async function copyToClipboard(data: string) {
  try {
    await navigator.clipboard.writeText(data);
  } catch (error) {
    console.error("Failed to copy to clipboard", error);
  }
}

export const flattenObject = (obj: any, prefix = "", result: any = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }

  return result;
};
export const formatJedError = (error: AxiosError) => {
  const errorMessage = (error.response?.data as { error: { message: string } })
    ?.error?.message;
  return errorMessage;
};

export const transformToLowerCase = (value: string) =>
  value.toLowerCase().replace("_", " ");

export interface BankIssuer {
  code: string;
  name: string;
}

export interface PaymentIssuer {
  code: string;
  name: string;
}

export function filterUniqueBanks(issuers: PaymentIssuer[]): BankIssuer[] {
  return issuers.reduce<BankIssuer[]>((acc, issuer: BankIssuer) => {
    if (!acc.some((bank) => bank.code === issuer.code)) {
      acc.push({ code: issuer.code, name: issuer.name });
    }
    return acc;
  }, []);
}

export const maskAccountNumber = (details: string): string => {
  return details.replace(/\b\d+\b/g, (value) => {
    if (value.length > 4) {
      return "****" + value.slice(-4);
    }
    return value;
  });
};
