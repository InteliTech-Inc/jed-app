import { API_URL } from "@/constants/url";
import { create } from "zustand";
import axios from "axios";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

interface UserStore {
  user: User | null;
  fetchUserById: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  fetchUserById: async (id: string) => {
    try {
      const response = await axios(`${API_URL}/users/${id}`);
      const data = response.data.data;
      set({ user: data });
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null });
    }
  },
}));
