import { useUser } from "#/context/useUser";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";

type AppLayoutProps = {
  children: React.ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const { data: user, isLoading, isError } = useUser();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && isError) {
      navigate({ to: "/" });
    }
  }, [isLoading, isError]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#111]">
        <span className="h-2 w-2 animate-ping rounded-full bg-[#fb923c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f5]">
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
