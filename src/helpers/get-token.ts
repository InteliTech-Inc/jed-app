import Cookies from "js-cookie";
import { COOKIE_NAME } from "@/constants/url";
import { jwtDecode } from "jwt-decode";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }
  const token = Cookies.get(COOKIE_NAME);
  if (!token) {
    return null;
  }
  return token;
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) {
    return null;
  }
  const decodedToken = jwtDecode(token);
  return decodedToken;
}
