import { Link, useRouterState } from "@tanstack/react-router";
import api from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "#/context/useUser";
import { PulseLogo } from "#/components/shared/pulse-logo";
import { FiLogOut } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSocket } from "#/context/socket-context";
import { useState } from "react";

type SidebarProps = {
  user: User;
  mobileOpen: boolean;
  desktopCollapsed: boolean;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
  onToggleDesktopCollapse: () => void;
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: GridIcon },
  { label: "Pulses", href: "/dashboard/pulses", icon: PulseIcon },
  { label: "Flairs", href: "/dashboard/flairs", icon: FlairIcon },
  { label: "Billing", href: "/dashboard/billing", icon: BillingIcon },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export function Sidebar({
  user,
  mobileOpen,
  desktopCollapsed,
  onToggleMobile,
  onCloseMobile,
  onToggleDesktopCollapse,
}: SidebarProps) {
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const { socket } = useSocket();
  const currentPath = routerState.location.pathname;
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await api.post("/auth/logout");
    queryClient.clear();
    socket?.disconnect();
    window.location.href = "/";
    setLoggingOut(false);
  };

  return (
    <>
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1f1f1f] bg-[#0e0e0e] px-4 py-4 lg:hidden">
        <div className="flex items-center gap-2">
          <PulseLogo size={24} />
          <span className="text-[15px] font-bold tracking-[-0.02em]">
            Pulse
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleMobile}
          className="cursor-pointer border border-[#1f1f1f] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#0e0e0e] transition-[width,transform] duration-300 lg:static lg:h-auto lg:max-w-none lg:translate-x-0 ${
          desktopCollapsed ? "lg:w-20" : "lg:w-55"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex items-center border-b border-[#1f1f1f] py-5 transition-[padding] duration-300 ${
            desktopCollapsed ? "justify-center px-3 lg:px-0" : "gap-2 px-6"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (desktopCollapsed) onToggleDesktopCollapse();
            }}
            className={`flex min-w-0 items-center gap-2 overflow-hidden ${
              desktopCollapsed ? "cursor-pointer" : "cursor-default"
            }`}
            aria-label={desktopCollapsed ? "Expand sidebar" : undefined}
          >
            <PulseLogo size={24} />
            <span
              className={`text-[15px] font-bold tracking-[-0.02em] transition-all duration-300 ${
                desktopCollapsed
                  ? "w-0 opacity-0 lg:-translate-x-2"
                  : "w-auto opacity-100"
              }`}
            >
              Pulse
            </span>
          </button>
          {!desktopCollapsed ? (
            <button
              type="button"
              onClick={onToggleDesktopCollapse}
              className="ml-auto hidden h-8 w-8 cursor-pointer items-center justify-center border border-[#1f1f1f] text-[#666] transition-colors hover:border-[#fb923c] hover:text-[#fb923c] lg:inline-flex"
              aria-label="Collapse sidebar"
            >
              <span className="text-sm transition-transform duration-300">
                ‹
              </span>
            </button>
          ) : null}
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active =
                href === "/dashboard"
                  ? currentPath === href
                  : currentPath === href || currentPath.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    to={href}
                    onClick={onCloseMobile}
                    title={desktopCollapsed ? label : undefined}
                    className={`flex items-center px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300 ${
                      active
                        ? "bg-[#1a1a1a] text-[#fb923c]"
                        : "text-[#666] hover:bg-[#161616] hover:text-[#f5f5f5]"
                    } ${desktopCollapsed ? "justify-center" : "gap-3"}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span
                      className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                        desktopCollapsed
                          ? "w-0 opacity-0 lg:-translate-x-2"
                          : "w-auto opacity-100"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#1f1f1f] p-4">
          <div
            className={`flex items-center transition-all duration-300 ${
              desktopCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div
              className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
                desktopCollapsed ? "w-0 opacity-0 lg:hidden" : "opacity-100"
              }`}
            >
              <p className="truncate text-[12px] font-medium">{user.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#fb923c]">
                {user.plan}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={desktopCollapsed ? "Sign out" : undefined}
            className={`mt-3 disabled:cursor-not-allowed disabled:border-[#1f1f1f] disabled:opacity-60 cursor-pointer font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
              desktopCollapsed
                ? "hidden w-full items-center justify-center text-red-400 hover:text-red-300 lg:flex"
                : "w-full border border-[#1f1f1f] py-2 text-[#444] hover:border-[#fb923c] hover:text-[#fb923c]"
            }`}
          >
            {loggingOut ? (
              <AiOutlineLoading3Quarters
                className="h-3.5 w-3.5 animate-spin mx-auto"
                color="#fb923c"
              />
            ) : desktopCollapsed ? (
              <FiLogOut className="h-3.5 w-3.5" />
            ) : (
              "Sign out"
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

// Inline SVG icons
function GridIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="6" height="6" rx="1" />
      <rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline
        points="1,8 4,8 5,4 7,12 9,6 11,8 15,8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlairIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M8 2L9.5 6h4L10 8.5l1.5 4L8 10l-3.5 2.5L6 8.5 2.5 6h4z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BillingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
      <path d="M1.5 6h13" strokeLinecap="round" />
      <path d="M10 10.5h2.5" strokeLinecap="round" />
    </svg>
  );
}
