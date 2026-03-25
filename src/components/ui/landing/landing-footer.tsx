import { PulseLogo } from "#/components/shared/pulse-logo";
import { footerLinks } from "./landing-data";

export function LandingFooter() {
  return (
    <footer className="border-t border-(--pulse-border) px-6 py-10 lg:px-15">
      <div className="mx-auto flex max-w-360 flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.02em] text-(--pulse-muted)">
          <PulseLogo size={22} />
          <span>Pulse</span>
        </div>

        <ul id="docs" className="flex flex-wrap items-center gap-6 md:gap-8">
          {footerLinks.map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                className="font-mono text-[11px] uppercase tracking-widest text-(--pulse-muted) transition-colors hover:text-(--pulse-white)"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="font-mono text-[11px] tracking-[0.06em] text-(--pulse-muted)">
          © 2026 Pulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
