import { API_URL } from "@/constants/url";
import { getToken } from "@/helpers/get-token";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error.message ?? String(error)));
  },
);
