import { CTASection } from "./cta-section";
import { FeaturesSection } from "./features-section";
import { FlowSection } from "./flow-section";
import { HeroSection } from "./hero-section";
import { LandingCursor } from "./landing-cursor";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import { MarqueeSection } from "./marquee-section";
import { PricingSection } from "./pricing-section";
import { useUser } from "../../../context/useUser";
import { useLandingCursor } from "./use-landing-cursor";

export function LandingPage() {
  const { cursorRef, ringRef } = useLandingCursor();
  const { data: user } = useUser();
  const isLoggedIn = Boolean(user);

  return (
    <main className="overflow-x-hidden bg-(--pulse-black) font-sans text-(--pulse-white) md:cursor-none overflow-y-scroll h-dvh">
      <LandingCursor cursorRef={cursorRef} ringRef={ringRef} />
      <LandingNav isLoggedIn={isLoggedIn} />
      <HeroSection isLoggedIn={isLoggedIn} />
      <MarqueeSection />
      <FeaturesSection />
      <FlowSection />
      <PricingSection />
      <CTASection isLoggedIn={isLoggedIn} />
      <LandingFooter />
    </main>
  );
}
