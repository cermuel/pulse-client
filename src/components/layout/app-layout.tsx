import { useUser } from "#/context/useUser";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./sidebar";
import { useSocket } from "#/context/socket-context";
import type { PingDetails, PulseFlair } from "#/types/routes/pulse-detail";
import { InAppNotifications } from "#/components/layout/in-app-notifications";
import {
  getPulseLabel,
  getPulseRouteId,
  syncNewPingIntoCache,
} from "#/utils/socket-events";

type AppLayoutProps = {
  children: React.ReactNode;
};

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  tone: "ping" | "danger" | "recovery";
  ctaLabel: string;
  onClick: () => void;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { data: user, isLoading, isError } = useUser();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const notificationTimeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!isLoading && isError) {
      navigate({ to: "/" });
    }
  }, [isLoading, isError]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [navigate]);

  useEffect(() => {
    if (!socket) return;

    const removeNotification = (id: string) => {
      const timeoutId = notificationTimeouts.current[id];
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        delete notificationTimeouts.current[id];
      }

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id),
      );
    };

    const pushNotification = (
      notification: Omit<NotificationItem, "id" | "onClick"> & {
        onAction: () => void;
      },
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setNotifications((current) => [
        {
          id,
          title: notification.title,
          description: notification.description,
          tone: notification.tone,
          ctaLabel: notification.ctaLabel,
          onClick: () => {
            removeNotification(id);
            notification.onAction();
          },
        },
        ...current,
      ]);

      notificationTimeouts.current[id] = window.setTimeout(() => {
        removeNotification(id);
      }, 7000);
    };

    const handleNewPing = (ping: PingDetails) => {
      console.log("[socket] received new-ping", ping);

      const currentPulseId = getPulseRouteId(window.location.pathname);

      syncNewPingIntoCache(queryClient, ping);
      queryClient.invalidateQueries({ queryKey: ["pulses"] });

      if (currentPulseId === ping.pulseId) return;

      const pulseLabel = getPulseLabel(queryClient, ping.pulseId);
      const pingState = ping.isUp ? "responded" : "failed";

      pushNotification({
        title: `${pulseLabel} ${pingState}`,
        description: ping.isUp
          ? `Latest check finished in ${ping.responseTime}ms.`
          : "Latest check failed. Open the pulse to inspect the history.",
        tone: "ping",
        ctaLabel: "Open pulse",
        onAction: () =>
          navigate({
            to: "/dashboard/$id",
            params: { id: ping.pulseId },
          }),
      });
    };

    const handleNewFlair = (flair: PulseFlair) => {
      console.log("[socket] received new-flair", flair);

      queryClient.invalidateQueries({ queryKey: ["flairs"] });
      queryClient.invalidateQueries({ queryKey: ["pulse", flair.pulseId] });

      pushNotification({
        title: flair.cause || "Service outage detected",
        description: "A new incident flair was opened. Jump into the timeline.",
        tone: "danger",
        ctaLabel: "View flair",
        onAction: () =>
          navigate({
            to: "/dashboard/flairs/$id",
            params: { id: flair.id },
          }),
      });
    };

    const handleFlairRecovery = (flair: PulseFlair) => {
      console.log("[socket] received flair-recovery", flair);

      queryClient.invalidateQueries({ queryKey: ["flairs"] });
      queryClient.invalidateQueries({ queryKey: ["pulse", flair.pulseId] });

      pushNotification({
        title: flair.cause || "Service recovered",
        description: "The incident recovered. Open the flair to review the full timeline.",
        tone: "recovery",
        ctaLabel: "View recovery",
        onAction: () =>
          navigate({
            to: "/dashboard/flairs/$id",
            params: { id: flair.id },
          }),
      });
    };

    socket.on("new-ping", handleNewPing);
    socket.on("new-flair", handleNewFlair);
    socket.on("flair-recovery", handleFlairRecovery);

    return () => {
      socket.off("new-ping", handleNewPing);
      socket.off("new-flair", handleNewFlair);
      socket.off("flair-recovery", handleFlairRecovery);
    };
  }, [navigate, queryClient, socket]);

  useEffect(() => {
    return () => {
      Object.values(notificationTimeouts.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#111]">
        <span className="h-2 w-2 animate-ping rounded-full bg-[#fb923c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5]">
      <InAppNotifications
        notifications={notifications}
        onDismiss={(id) => {
          const timeoutId = notificationTimeouts.current[id];
          if (timeoutId) {
            window.clearTimeout(timeoutId);
            delete notificationTimeouts.current[id];
          }

          setNotifications((current) =>
            current.filter((notification) => notification.id !== id),
          );
        }}
      />
      <div className="flex h-dvh flex-col lg:flex-row">
        <Sidebar
          user={user!}
          mobileOpen={mobileNavOpen}
          desktopCollapsed={desktopSidebarCollapsed}
          onToggleMobile={() => setMobileNavOpen((current) => !current)}
          onCloseMobile={() => setMobileNavOpen(false)}
          onToggleDesktopCollapse={() =>
            setDesktopSidebarCollapsed((current) => !current)
          }
        />
        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
