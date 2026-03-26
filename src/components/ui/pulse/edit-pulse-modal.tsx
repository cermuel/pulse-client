import type { Dispatch, SetStateAction } from "react";

type EditPulseForm = {
  publicId: string;
  name: string;
  interval: number;
  expectedStatus: number;
};

type EditPulseModalProps = {
  pulse: {
    name: string;
    publicId: string;
  };
  isFreePlan: boolean;
  form: EditPulseForm;
  errorMessage?: string;
  isSaving: boolean;
  onChange: Dispatch<SetStateAction<EditPulseForm>>;
  onClose: () => void;
  onSave: () => void;
};

export function EditPulseModal({
  pulse,
  isFreePlan,
  form,
  errorMessage,
  isSaving,
  onChange,
  onClose,
  onSave,
}: EditPulseModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl border border-[rgba(245,245,245,0.08)] bg-[#111] p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
          Edit pulse
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
          Update monitor settings
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
          Change the core pulse settings for{" "}
          <span className="text-[#f5f5f5]">{pulse.name || pulse.publicId}</span>.
        </p>

        {errorMessage && (
          <div className="mt-6 border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-[11px] text-red-400">
            {errorMessage}
          </div>
        )}

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <input
            type="text"
            placeholder="Name (optional)"
            value={form.name}
            onChange={(event) =>
              onChange((current) => ({ ...current, name: event.target.value }))
            }
            className="w-full border border-[#1f1f1f] bg-[#111] px-5 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none transition-colors focus:border-[#fb923c]"
          />

          <div className="flex items-center border border-[#1f1f1f] bg-[#111] transition-colors focus-within:border-[#fb923c]">
            <span className="border-r border-[#1f1f1f] px-4 py-3.5 font-mono text-[11px] text-[#2a2a2a]">
              pulse.app/s/
            </span>
            <input
              type="text"
              placeholder="public-id (optional)"
              value={form.publicId}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  publicId: event.target.value,
                }))
              }
              className="flex-1 bg-transparent px-4 py-3.5 font-mono text-[13px] text-[#f5f5f5] placeholder-[#2a2a2a] outline-none"
            />
          </div>

          <div className="space-y-4 border border-[#1a1a1a] p-4">
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
                          onChange((current) => ({
                            ...current,
                            interval: value,
                          }))
                        }
                        disabled={isDisabled}
                        className={`w-full border py-2.5 font-mono text-[10px] uppercase tracking-wider transition-colors sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                          form.interval === value
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

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#333]">
                Expected status
              </p>
              <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-0">
                {[200, 201, 204, 301, 302].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      onChange((current) => ({
                        ...current,
                        expectedStatus: status,
                      }))
                    }
                    className={`cursor-pointer border py-2.5 font-mono text-[10px] tracking-wider transition-colors sm:flex-1 sm:border-b sm:border-r sm:border-t sm:first:border-l ${
                      form.expectedStatus === status
                        ? "border-[#fb923c] bg-[#fb923c]/10 text-[#fb923c]"
                        : "border-[#1f1f1f] bg-[#0e0e0e] text-[#444] hover:text-[#f5f5f5]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex cursor-pointer items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex cursor-pointer items-center justify-center bg-[#fb923c] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
