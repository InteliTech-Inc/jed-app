import { API_URL } from "@/constants/url";
import axios from "axios";

const QUERY_FUNCTIONS = {
  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },
};

export default QUERY_FUNCTIONS;
