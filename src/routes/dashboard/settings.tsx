import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "#/components/layout/app-layout";
import { useUser } from "#/context/useUser";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { data: user } = useUser();

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
            Settings
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
            Review your account details, default workspace preferences, and
            high-impact actions for this account.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="border border-[#1f1f1f] bg-[#111]">
              <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Account
                </p>
              </div>

              <div className="divide-y divide-[#1a1a1a]">
                <SettingsRow
                  label="Name"
                  value={user?.name || "Unnamed user"}
                  description="The display name attached to your account."
                />
                <SettingsRow
                  label="Email"
                  value={user?.email || "—"}
                  description="Primary email used for login and notifications."
                />
                <SettingsRow
                  label="Provider"
                  value={user?.provider || "github"}
                  description="OAuth provider currently connected to this account."
                />
              </div>
            </div>

            <div className="mt-8 border border-[#1f1f1f] bg-[#111]">
              <div className="border-b border-[#1f1f1f] px-4 py-4 sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#666]">
                  Preferences
                </p>
              </div>

              <div className="divide-y divide-[#1a1a1a]">
                <ToggleRow
                  title="Email alerts"
                  description="Receive incident and recovery notifications in your inbox."
                  enabled
                />
                <ToggleRow
                  title="Status summaries"
                  description="Get periodic summaries about monitor health and incident activity."
                  enabled={false}
                />
                <ToggleRow
                  title="Product updates"
                  description="Receive occasional updates about new monitoring features."
                  enabled={false}
                />
              </div>
            </div>

            <div className="mt-8 border border-red-500/15 bg-[#111]">
              <div className="border-b border-red-500/10 px-4 py-4 sm:px-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-red-400">
                  Danger zone
                </p>
              </div>

              <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5]">
                    Delete workspace data
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#777]">
                    Permanently remove your account, pulses, flairs, and stored
                    monitoring history.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex cursor-pointer items-center justify-center border border-red-500/25 bg-red-500/5 px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
              <p className="text-sm font-semibold text-[#f5f5f5]">Profile</p>
              <div className="mt-5 flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-[#1a1a1a]" />
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#f5f5f5]">
                    {user?.name || "Unnamed user"}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[#fb923c]">
                    {user?.plan || "free"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-[#1f1f1f] bg-[#111] px-4 py-5 sm:px-6">
              <p className="text-sm font-semibold text-[#f5f5f5]">
                Quick actions
              </p>
              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center border border-[#1f1f1f] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                >
                  Manage notifications
                </button>
                <button
                  type="button"
                  className="inline-flex w-full cursor-pointer items-center justify-center border border-[#1f1f1f] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#555] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
                >
                  Export account data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SettingsRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
        <p className="mt-1 text-sm text-[#666]">{description}</p>
      </div>
      <p className="break-words font-mono text-[11px] uppercase tracking-widest text-[#fb923c]">
        {value}
      </p>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
}: {
  title: string;
  description: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#f5f5f5]">{title}</p>
        <p className="mt-1 text-sm leading-6 text-[#666]">{description}</p>
      </div>
      <button
        type="button"
        className={`relative mt-1 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
          enabled ? "bg-[#fb923c]" : "bg-[#1f1f1f]"
        }`}
        aria-pressed={enabled}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-[#0e0e0e] transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
