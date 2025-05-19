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

export function setToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set(COOKIE_NAME, token);
}

export function clearToken() {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove(COOKIE_NAME);
}

export function getUserFromToken() {
  const token = getToken();
  if (!token) {
    return null;
  }
  const decodedToken = jwtDecode(token);
  return decodedToken;
}
