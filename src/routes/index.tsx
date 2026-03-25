import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "../components/ui/landing/landing-page";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return <LandingPage />;
}
