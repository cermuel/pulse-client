import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import io, { Socket } from "socket.io-client";
import { useUser } from "./useUser";
import { BASE_URL } from "#/lib/api";

interface SocketContextProps {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined,
);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: user } = useUser();

  useEffect(() => {
    if (!user) return;

    const socketInit = io(BASE_URL, {
      auth: { user },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInit.connect();
    setSocket(socketInit);

    return () => {
      socketInit.disconnect();
      setSocket(null);
    };
  }, [user]);

  return <SocketContext value={{ socket }}>{children}</SocketContext>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export default SocketProvider;
