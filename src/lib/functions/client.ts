import { API_URL } from "@/constants/url";
import { Event, EventResponse } from "@/interfaces/event";
import { authAxios } from "@/providers/api-client";
import axios from "axios";

const QUERY_FUNCTIONS = {
  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },
  createEvent: async (payload: Event) => {
    const response = await authAxios.post("/events", payload);
    return response.data;
  },

  updateEvent: async (payload: EventResponse, id: string) => {
    const response = await authAxios.patch(`/events/${id}`, payload);
    return response.data;
  },

  deleteEvent: async (id: string) => {
    const response = await authAxios.delete(`/events/${id}`);
    return response.data;
  },

  fetchEvents: async () => {
    const response = await authAxios.get("/events/user");
    return response.data;
  },
};

export default QUERY_FUNCTIONS;
