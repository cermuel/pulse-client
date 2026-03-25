import { Link, useRouterState } from "@tanstack/react-router";
import api from "../../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "#/context/useUser";
import { PulseLogo } from "#/components/shared/pulse-logo";

type SidebarProps = {
  user: User;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
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
  onToggleMobile,
  onCloseMobile,
}: SidebarProps) {
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await api.post("/auth/logout");
    queryClient.clear();
    window.location.href = "/";
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#0e0e0e] transition-transform duration-200 lg:static lg:h-auto lg:w-55 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 border-b border-[#1f1f1f] px-6 py-5">
          <PulseLogo size={24} />
          <span className="text-[15px] font-bold tracking-[-0.02em]">
            Pulse
          </span>
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
                    className={`flex items-center gap-3 px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      active
                        ? "bg-[#1a1a1a] text-[#fb923c]"
                        : "text-[#666] hover:bg-[#161616] hover:text-[#f5f5f5]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#1f1f1f] p-4">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium">{user.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#fb923c]">
                {user.plan}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 w-full cursor-pointer border border-[#1f1f1f] py-2 font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
          >
            Sign out
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
