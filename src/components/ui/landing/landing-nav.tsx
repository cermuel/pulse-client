import { Link } from "@tanstack/react-router";
import { PulseLogo } from "#/components/shared/pulse-logo";
import { navLinks } from "./landing-data";

type LandingNavProps = {
  isLoggedIn: boolean;
};

export function LandingNav({ isLoggedIn }: LandingNavProps) {
  return (
    <nav className="border-b border-(--pulse-border) bg-(--pulse-black) px-6 py-5 lg:px-15">
      <div className="mx-auto max-w-360">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xl font-bold tracking-[-0.02em]">
            <PulseLogo size={28} />
            <span>Pulse</span>
          </div>

          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-(--pulse-muted) transition-colors hover:text-(--pulse-white)"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="bg-(--pulse-orange) px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-(--pulse-black) transition-colors hover:bg-(--pulse-white)"
          >
            {isLoggedIn ? "Dashboard" : "Get started"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
