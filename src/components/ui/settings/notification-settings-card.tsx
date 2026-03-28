import type { Notification } from "#/context/useUser";
import { NotificationToggleRow } from "#/components/ui/settings/notification-toggle-row";
import { FaChevronDown } from "react-icons/fa6";

type NotificationSettingsCardProps = {
  form: Notification;
  isFreePlan: boolean;
  isOpen: boolean;
  isPending: boolean;
  isSuccess: boolean;
  errorMessage?: string;
  onToggleOpen: () => void;
  onToggle: (
    key: keyof Pick<
      Notification,
      "email" | "inAppPing" | "inAppFlair" | "whatsapp" | "telegram"
    >,
    value: boolean,
  ) => void;
  onSubmit: () => void;
};

export function NotificationSettingsCard({
  form,
  isFreePlan,
  isOpen,
  isPending,
  isSuccess,
  errorMessage,
  onToggleOpen,
  onToggle,
  onSubmit,
}: NotificationSettingsCardProps) {
  return (
    <div className="border border-[#1f1f1f] bg-[#111]">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full cursor-pointer items-center justify-between border-b border-[#1f1f1f] px-4 py-4 text-left transition-colors hover:bg-[#141414] sm:px-6"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
          Notifications
        </p>
        <span
          className={` text-[#666] transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <FaChevronDown size={12} />
        </span>
      </button>

      {isOpen ? (
        <form
          className="space-y-4 px-4 py-5 sm:px-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <NotificationToggleRow
            label="Email alerts"
            description="Get monitoring updates in your inbox."
            checked={form.email}
            onChange={(checked) => onToggle("email", checked)}
          />
          <NotificationToggleRow
            label="In-app ping updates"
            description="Show live ping activity inside the dashboard."
            checked={form.inAppPing}
            onChange={(checked) => onToggle("inAppPing", checked)}
          />
          <NotificationToggleRow
            label="In-app flair updates"
            description="Show incident and recovery notifications in the app."
            checked={form.inAppFlair}
            onChange={(checked) => onToggle("inAppFlair", checked)}
          />
          <NotificationToggleRow
            label="WhatsApp alerts"
            description={
              isFreePlan
                ? "Available on PRO plans."
                : "Send monitoring alerts to WhatsApp."
            }
            checked={form.whatsapp}
            disabled={isFreePlan}
            onChange={(checked) => onToggle("whatsapp", checked)}
          />
          <NotificationToggleRow
            label="Telegram alerts"
            description={
              isFreePlan
                ? "Available on PRO plans."
                : "Send monitoring alerts to Telegram."
            }
            checked={form.telegram}
            disabled={isFreePlan}
            onChange={(checked) => onToggle("telegram", checked)}
          />

          {isSuccess ? (
            <p className="font-mono text-[11px] text-green-500">
              Notification preferences saved.
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
