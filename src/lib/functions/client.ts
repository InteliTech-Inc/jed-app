import { API_URL } from "@/constants/url";
import { Event } from "@/interfaces/event";
import { apiClient } from "@/providers/api-client";
import axios from "axios";

const QUERY_FUNCTIONS = {
  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },
  createEvent: async (payload: Event) => {
    const response = await apiClient.post("/events", payload);
    return response.data;
  },
};

export default QUERY_FUNCTIONS;
