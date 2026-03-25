import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AppLayout } from "#/components/layout/app-layout";
import { useUser } from "#/context/useUser";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/pulses/new")({
  component: NewPulsePage,
});

function NewPulsePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const [form, setForm] = useState({
    name: "",
    url: "",
    publicId: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advanced, setAdvanced] = useState({
    method: "GET",
    interval: 300,
    expectedStatus: 200,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isFreePlan = user?.plan === "free";

  const { data: pulseMeta } = useQuery({
    queryKey: ["pulses", "meta"],
    queryFn: async () => {
      const res = await api.get("/pulse", {
        params: { page: 1, per_page: 1 },
      });
      return res.data as { total: number };
    },
  });

  const pulseCount = pulseMeta?.total ?? 0;
  const hasReachedFreeLimit = isFreePlan && pulseCount >= 5;

  const { data: publicIdCheck } = useQuery({
    queryKey: ["publicId", form.publicId],
    queryFn: async () => {
      const res = await api.get(`/pulse/${form.publicId}/check`);
      return res.data;
    },
    enabled: form.publicId.length > 2,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/pulse", {
        name: form.name || undefined,
        url: form.url,
        publicId: form.publicId || undefined,
        ...advanced,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["pulses"] });
      navigate({ to: "/dashboard/$id", params: { id: data.pulse.id } });
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message;
      setErrors({
        general: typeof message === "string" ? message : "Something went wrong",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2: Record<string, string> = {};
    if (!form.url) e2.url = "URL is required";
    if (form.url && !form.url.startsWith("http"))
      e2.url = "Must start with http:// or https://";
    if (form.publicId && publicIdCheck?.codeAvailable === false)
      e2.publicId = "Already taken";
    if (hasReachedFreeLimit)
      e2.general = "Free plan includes up to 5 pulses. Upgrade to add more.";
    if (isFreePlan && advanced.interval === 60)
      e2.general = "1-minute checks are only available on Pro.";
    setErrors(e2);
    if (!Object.keys(e2).length) mutate();
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-8 flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#444] transition-colors hover:text-[#fb923c]"
        >
          ← Back
        </button>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
          New pulse
        </p>
        <h1 className="mt-1 mb-8 text-[28px] font-extrabold tracking-[-0.03em]">
          Add a URL to monitor
        </h1>

        {hasReachedFreeLimit && (
          <div className="mb-6 border border-[#fb923c]/20 bg-[#fb923c]/6 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#fb923c]">
              Free plan limit reached
            </p>
            <p className="mt-2 text-sm leading-6 text-[#8d8d8d]">
              You already have {pulseCount} pulses. Free accounts can monitor up
              to 5 pulses, so you&apos;ll need to upgrade before creating
              another one.
            </p>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-[11px] text-red-400">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL — primary field, big and obvious */}
          <div>
            <input
              type="text"
              placeholder="https://api.myapp.com/health"
              value={form.url}
              onChange={(e) => {
                setForm((p) => ({ ...p, url: e.target.value }));
                setErrors((p) => ({ ...p, url: "" }));
              }}
              className={`w-full border bg-[#111] px-5 py-4 font-mono text-[14px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none transition-colors focus:border-[#fb923c] ${
                errors.url ? "border-red-500/50" : "border-[#1f1f1f]"
              }`}
            />
            {errors.url && (
              <p className="mt-1.5 font-mono text-[10px] text-red-400">
                {errors.url}
              </p>
            )}
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Name (optional)"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full border border-[#1f1f1f] bg-[#111] px-5 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none transition-colors focus:border-[#fb923c]"
          />

          {/* Public ID */}
          <div>
            <div className="flex items-center border border-[#1f1f1f] bg-[#111] transition-colors focus-within:border-[#fb923c]">
              <span className="border-r border-[#1f1f1f] px-4 py-3.5 font-mono text-[11px] text-[#2a2a2a]">
                pulse.app/s/
              </span>
              <input
                type="text"
                placeholder="public-id (optional)"
                value={form.publicId}
                onChange={(e) => {
                  setForm((p) => ({ ...p, publicId: e.target.value }));
                  setErrors((p) => ({ ...p, publicId: "" }));
                }}
                className="flex-1 bg-transparent px-4 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none"
              />
              {/* Availability indicator */}
              {form.publicId.length > 2 && (
                <span
                  className={`mr-4 font-mono text-[10px] uppercase tracking-wider ${
                    publicIdCheck?.codeAvailable === true
                      ? "text-green-500"
                      : publicIdCheck?.codeAvailable === false
                        ? "text-red-400"
                        : "text-[#333]"
                  }`}
                >
                  {publicIdCheck?.codeAvailable === true
                    ? "✓ available"
                    : publicIdCheck?.codeAvailable === false
                      ? "✗ taken"
                      : "..."}
                </span>
              )}
            </div>
            {errors.publicId && (
              <p className="mt-1.5 font-mono text-[10px] text-red-400">
                {errors.publicId}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((p) => !p)}
            className="flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#333] transition-colors hover:text-[#fb923c]"
          >
            <span
              className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}
            >
              ▶
            </span>
            Advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-4 border border-[#1a1a1a] p-4">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                  Method
                </p>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-0">
                  {["GET", "POST", "HEAD"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAdvanced((p) => ({ ...p, method: m }))}
                        className={`cursor-pointer border py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:flex-1 sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                          advanced.method === m
                            ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                            : "border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval */}
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                  Check interval
                </p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-0">
                  {[
                    { label: "1m", value: 60 },
                    { label: "5m", value: 300 },
                    { label: "10m", value: 600 },
                    { label: "30m", value: 1800 },
                    { label: "1h", value: 3600 },
                  ].map(({ label, value }) => {
                    const isDisabled = isFreePlan && value === 60;
                    return (
                      <div
                        key={value}
                        className={`group relative flex-1 ${isDisabled ? "z-10" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            !isDisabled &&
                            setAdvanced((p) => ({ ...p, interval: value }))
                          }
                          disabled={isDisabled}
                        className={`w-full border py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                            advanced.interval === value
                              ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                              : isDisabled
                                ? "cursor-not-allowed border-[#1f1f1f] bg-[#0e0e0e] text-[#2f2f2f] line-through"
                                : "cursor-pointer border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                          }`}
                        >
                          {label}
                        </button>
                        {isDisabled && (
                          <div className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap border border-[#2a2a2a] bg-[#0b0b0b] px-3 py-2 font-mono text-[10px] text-[#f5f5f5] shadow-[0_12px_24px_rgba(0,0,0,0.35)] group-hover:block">
                            1m checks are available on Pro only.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expected status */}
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                  Expected status
                </p>
                <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-0">
                  {[200, 201, 204, 301, 302].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() =>
                        setAdvanced((p) => ({ ...p, expectedStatus: s }))
                      }
                      className={`cursor-pointer border py-2.5 font-mono text-[10px] tracking-wider transition-colors sm:flex-1 sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                        advanced.expectedStatus === s
                          ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                          : "border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isPending ||
              publicIdCheck?.codeAvailable === false ||
              !form.url ||
              hasReachedFreeLimit
            }
            className="w-full bg-[#fb923c] disabled:hover:bg-[#fb923c] cursor-pointer py-4 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-40 mt-4"
          >
            {isPending ? "Creating..." : "Create pulse →"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
