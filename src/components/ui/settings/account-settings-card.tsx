import { SettingsField } from "#/components/ui/settings/settings-field";
import { FaChevronDown } from "react-icons/fa6";

type AccountSettingsCardProps = {
  name: string;
  email?: string;
  provider?: string;
  isOpen: boolean;
  isPending: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  onToggleOpen: () => void;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
};

export function AccountSettingsCard({
  name,
  email,
  provider,
  isOpen,
  isPending,
  isSuccess,
  errorMessage,
  onToggleOpen,
  onNameChange,
  onSubmit,
}: AccountSettingsCardProps) {
  return (
    <div className="border border-[#1f1f1f] bg-[#111]">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full cursor-pointer items-center justify-between border-b border-[#1f1f1f] px-4 py-4 text-left transition-colors hover:bg-[#141414] sm:px-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
          Account
        </p>
        <span
          className={` text-[#666] transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <FaChevronDown size={12} />
        </span>
      </button>

      {isOpen ? (
        <form
          className="space-y-5 px-4 py-5 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <SettingsField
            label="Display name"
            description="The name shown across your workspace."
          >
            <input
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="Your name"
              className="w-full border border-[#1f1f1f] bg-[#111] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] placeholder-[#333] outline-none transition-colors focus:border-[#fb923c]"
            />
          </SettingsField>

          <SettingsField
            label="Email"
            description="Primary email attached to your OAuth account."
          >
            <div className="w-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 font-mono text-[12px] text-[#777]">
              {email || "—"}
            </div>
          </SettingsField>

          <SettingsField
            label="Provider"
            description="OAuth provider currently connected to this account."
          >
            <div className="w-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 font-mono text-[12px] uppercase tracking-widest text-[#777]">
              {provider || "github"}
            </div>
          </SettingsField>

          {isSuccess ? (
            <p className="font-mono text-[11px] text-green-500">
              Profile saved successfully.
            </p>
          ) : null}

          {errorMessage ? (
            <p className="font-mono text-[11px] text-red-400">{errorMessage}</p>
          ) : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex cursor-pointer items-center justify-center bg-[#fb923c] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
