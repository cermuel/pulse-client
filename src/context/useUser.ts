import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  provider: string;
  createdAt: string;
};

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get<User>("/user/me");
      return res.data;
    },
  });
}
