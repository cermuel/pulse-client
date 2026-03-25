import { Link } from "@tanstack/react-router";
import { heroPrimaryIcon } from "./landing-data";
import { HeroVisual } from "./hero-visual";

const HeroPrimaryIcon = heroPrimaryIcon;

type HeroSectionProps = {
  isLoggedIn: boolean;
};

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  return (
    <section className="px-6 py-16 lg:px-15 lg:py-24">
      <div className="mx-auto flex max-w-360 flex-col items-center gap-12 text-center">
        <div className="max-w-5xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--pulse-orange)">
            Uptime monitoring
          </div>

          <h1 className="mt-6 text-[clamp(40px,6vw,84px)] leading-[0.96] font-extrabold tracking-[-0.04em]">
            Know before
            <br />
            <span className="text-(--pulse-orange)">they do.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-(--pulse-muted)">
            Pulse keeps watch on your critical services and lets you know the
            moment performance slips, checks fail, or incidents start to form.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link
              to={isLoggedIn ? "/dashboard" : "/auth"}
              className="inline-flex items-center justify-center gap-3 bg-(--pulse-orange) px-8 py-4 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-(--pulse-black) transition-colors hover:bg-(--pulse-white)"
            >
              <HeroPrimaryIcon className="h-4 w-4" />
              <span>{isLoggedIn ? "Go to dashboard" : "Start monitoring free"}</span>
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center border border-(--pulse-border-bright) px-8 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-(--pulse-white-2) transition-colors hover:border-(--pulse-orange) hover:text-(--pulse-orange)"
            >
              See live demo
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
