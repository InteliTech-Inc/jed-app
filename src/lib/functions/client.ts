import { API_URL } from "@/constants/url";
import { Event, UpdateEventPayload } from "@/interfaces/event";
import { authAxios } from "@/providers/api-client";
import axios from "axios";

interface Nominee {
  full_name: string;
  category_id: string;
  image: string;
  event_id: string;
}

const QUERY_FUNCTIONS = {
  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  updateUser: async (payload: any, id: string) => {
    const response = await authAxios.patch(`/users/${id}`, payload);
    return response.data;
  },

  createEvent: async (payload: Event) => {
    const response = await authAxios.post("/events", payload);
    return response.data;
  },

  updateEvent: async (payload: UpdateEventPayload, id: string) => {
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

  createNominee: async (payload: Nominee) => {
    const response = await authAxios.post(`/nominee`, payload);
    return response.data;
  },

  updateNominee: async (payload: Nominee, id: string) => {
    const response = await authAxios.patch(`/nominee/${id}`, payload);
    return response.data;
  },

  deleteNominee: async (id: string) => {
    const response = await authAxios.delete(`/nominee/${id}`);
    return response.data;
  },

  fetchNominees: async () => {
    const response = await authAxios.get(`/nominee`);
    return response.data;
  },

  fetchCategories: async () => {
    const response = await authAxios.get(`/category`);
    return response.data;
  },

  fetchVotes: async () => {
    const response = await authAxios.get(`/voting`);
    return response.data;
  },
  changePassword: async (payload: {
    email: string;
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }) => {
    const response = await authAxios.post(`/auth/change-password`, payload);
    return response.data;
  },
};

export default QUERY_FUNCTIONS;
