import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./constants/url";

export default async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const publicUrl = [
    "/",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/not-found",
  ];

  if (publicUrl.includes(req.nextUrl.pathname)) {
    return res;
  }

  let accessToken = req.cookies.get(COOKIE_NAME)?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
