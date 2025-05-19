import { API_URL } from "@/constants/url";
import { getToken, setToken, clearToken } from "@/helpers/get-token";
import axios from "axios";

export const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

authAxios.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(new Error(error.message ?? String(error))),
);

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${API_URL}/auth/refresh-tokens`, {});

        const newAccessToken = res.data.accessToken;
        setToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        clearToken();
        window.location.href = "/login";
        return Promise.reject(
          new Error((refreshError as Error).message ?? String(refreshError)),
        );
      }
    }

    return Promise.reject(new Error(error.message ?? String(error)));
  },
);
