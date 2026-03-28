import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";

export interface Notification {
  id: string;
  userId: string;
  email: boolean;
  inAppFlair: boolean;
  inAppPing: boolean;
  whatsapp: boolean;
  telegram: boolean;
}
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: string;
  provider: string;
  createdAt: string;
  notificationId: string;
  notification: Notification;
};

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get<User>("/user/me");
      console.log({ res });
      return res.data;
    },
  });
}
