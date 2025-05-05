export const __BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_URL
    : process.env.NEXT_PUBLIC_DEV_URL;
