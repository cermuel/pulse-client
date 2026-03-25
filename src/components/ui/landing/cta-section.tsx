import { Link } from "@tanstack/react-router";
import { ctaPrimaryIcon } from "./landing-data";

const CTAIcon = ctaPrimaryIcon;

type CTASectionProps = {
  isLoggedIn: boolean;
};

export function CTASection({ isLoggedIn }: CTASectionProps) {
  return (
    <section className="border-t border-(--pulse-border) px-6 py-24 text-center lg:px-15 lg:py-30">
      <div className="mx-auto max-w-360">
        <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-(--pulse-orange)">Start now</div>
        <h2 className="mt-6 text-[clamp(44px,7vw,100px)] leading-[0.95] font-extrabold tracking-[-0.04em]">
          Your services
          <br />
          <span className="text-(--pulse-orange)">deserve better.</span>
        </h2>
        <p className="mt-8 font-mono text-base text-(--pulse-muted)">
          Free forever. No credit card. Up in 60 seconds.
        </p>
        <div className="mt-12 flex justify-center">
          <Link
            to={isLoggedIn ? "/dashboard" : "/auth"}
            className="inline-flex items-center justify-center gap-3 bg-(--pulse-orange) px-8 py-4 font-mono text-[13px] font-medium uppercase tracking-[0.08em] text-(--pulse-black) transition-colors hover:bg-(--pulse-white)"
          >
            <CTAIcon className="h-4 w-4" />
            <span>{isLoggedIn ? "Open dashboard" : "Continue to sign in"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
