import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { queryClient } from "../../lib/queryClient";
import api from "../../lib/api";

export const Route = createFileRoute("/auth/callback")({
  component: CallbackPage,
});

function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeSignIn = async () => {
      for (let attempt = 0; attempt < 4; attempt += 1) {
        try {
          await api.get("/user/me");
          if (cancelled) return;

          queryClient.invalidateQueries({ queryKey: ["user"] });
          navigate({ to: "/dashboard" });
          return;
        } catch {
          await new Promise((resolve) => window.setTimeout(resolve, 500));
        }
      }

      if (!cancelled) {
        setError("We couldn't find an authenticated session after the callback.");
      }
    };

    completeSignIn();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111] px-6">
        <div className="w-full max-w-md border border-[rgba(245,245,245,0.08)] bg-[#161616] p-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
            Auth error
          </p>
          <h1 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
            Session not found
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">{error}</p>
          <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
            Your frontend callback is running, but `/user/me` is still
            returning `401 Unauthorized`.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#111]">
      <div className="flex flex-col items-center gap-4">
        <span className="h-2 w-2 animate-ping rounded-full bg-[#fb923c]" />
        <p className="font-mono text-xs uppercase tracking-widest text-[#666]">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
