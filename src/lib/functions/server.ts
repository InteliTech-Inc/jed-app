import { COOKIE_NAME } from "@/constants/url";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@/constants/url";
import axios from "axios";

async function getUserFromServer() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(COOKIE_NAME)?.value;

  if (!token) return null;

  const decodedJwt = jwtDecode(token);
  const res = await axios(`${API_URL}/users/${decodedJwt.sub}`);

  return res.data;
}

export default getUserFromServer;
