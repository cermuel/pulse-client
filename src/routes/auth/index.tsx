import { createFileRoute, Link } from "@tanstack/react-router";
import { FaArrowLeft, FaGithub, FaGoogle } from "react-icons/fa6";
import { PulseLogo } from "#/components/shared/pulse-logo";
import api from "../../lib/api";

export const Route = createFileRoute("/auth/")({
  component: AuthIndexPage,
});

function AuthIndexPage() {
  const googleAuthUrl = new URL(
    "/auth/google",
    api.defaults.baseURL,
  ).toString();
  const githubAuthUrl = new URL(
    "/auth/github",
    api.defaults.baseURL,
  ).toString();

  return (
    <main className="relative min-h-screen bg-(--pulse-black) px-6 py-10 text-(--pulse-white) lg:px-15">
      <div className="flex min-h-[calc(100vh-88px)] items-center justify-center">
        <div className="w-full max-w-md border border-(--pulse-border) bg-(--pulse-black-2) p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <PulseLogo size={30} />
            <span className="text-lg font-bold tracking-[-0.02em]">Pulse</span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-(--pulse-muted) transition-colors hover:text-(--pulse-white)"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back
          </Link>
          <p className="font-mono text-xl mt-4 uppercase tracking-[0.18em] text-[#fb923c]">
            Sign in
          </p>

          <p className="text-sm leading-6 text-[#7a7a7a]">
            Choose a provider to continue into Pulse.
          </p>

          <div className="mt-6 grid gap-3">
            <a
              href={googleAuthUrl}
              className="inline-flex w-full items-center justify-center gap-3 border border-[rgba(245,245,245,0.14)] px-4 py-3 text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
            >
              <FaGoogle className="h-4 w-4 shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                Continue with Google
              </span>
            </a>

            <a
              href={githubAuthUrl}
              className="inline-flex w-full items-center justify-center gap-3 border border-[rgba(245,245,245,0.14)] px-4 py-3 text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
            >
              <FaGithub className="h-4 w-4 shrink-0" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                Continue with GitHub
              </span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
