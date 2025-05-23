import { COOKIE_NAME, API_URL } from "@/constants/url";
import { cookies } from "next/headers";
import axios from "axios";
import { authAxios } from "@/providers/api-client";

export default async function getUserFromServer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!token) return null;

  const res = await axios(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function fetchEvents() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const res = await authAxios.get(`${API_URL}/events/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}
