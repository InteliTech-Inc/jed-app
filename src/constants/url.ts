export const __BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_LIVE_URL
    : process.env.NEXT_PUBLIC_DEV_URL;

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const COOKIE_NAME = "jed-app-auth-token_&&_authentikos_persona";
