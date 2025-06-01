import { QUERY_KEYS } from "@/constants/query-keys";
import QUERY_FUNCTIONS from "@/lib/functions/client";
import { useQuery } from "@tanstack/react-query";
import { getUserFromToken } from "@/helpers/get-token";

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  phone_number?: string;
  organization?: string;
  role?: string;
  media?: {
    url: string;
  };
};

export const useUser = () => {
  const { getUser } = QUERY_FUNCTIONS;
  const id = getUserFromToken()?.sub;

  if (!id) {
    return { user: null, isLoading: false, error: null };
  }
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: async () => {
      const response = await getUser(id);
      return response.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { user: data as User, isLoading, error };
};
