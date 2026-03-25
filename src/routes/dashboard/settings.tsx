import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "#/components/layout/app-layout";
import { useUser } from "#/context/useUser";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [name, setName] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
  }, [user]);

  const deleteTarget = useMemo(
    () => user?.email || user?.name || "your account",
    [user],
  );

  const canDelete =
    deleteValue.trim().toLowerCase() === deleteTarget.trim().toLowerCase();

  const editUser = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/user", {
        name: name.trim() || undefined,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async () => {
      const res = await api.delete("/user");
      return res.data;
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["pulses"] });
      queryClient.removeQueries({ queryKey: ["pulse"] });
      queryClient.removeQueries({ queryKey: ["flairs"] });

      try {
        await api.post("/auth/logout");
      } catch {
        // Account may already be gone; continue out of the dashboard either way.
      }

      navigate({ to: "/" });
    },
  });

  return (
    <AppLayout>
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#fb923c]">
            Settings
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7a7a7a]">
            Update your account profile and handle the high-impact actions for
            this workspace.
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

              <form
                className="space-y-5 px-4 py-5 sm:px-6"
                onSubmit={(event) => {
                  event.preventDefault();
                  editUser.mutate();
                }}
              >
                <Field label="Display name" description="The name shown across your workspace.">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full border border-[#1f1f1f] bg-[#111] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] placeholder-[#333] outline-none transition-colors focus:border-[#fb923c]"
                  />
                </Field>

                <Field
                  label="Email"
                  description="Primary email attached to your OAuth account."
                >
                  <div className="w-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 font-mono text-[12px] text-[#777]">
                    {user?.email || "—"}
                  </div>
                </Field>

                <Field
                  label="Provider"
                  description="OAuth provider currently connected to this account."
                >
                  <div className="w-full border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3 font-mono text-[12px] uppercase tracking-widest text-[#777]">
                    {user?.provider || "github"}
                  </div>
                </Field>

                {editUser.isSuccess ? (
                  <p className="font-mono text-[11px] text-green-500">
                    Profile saved successfully.
                  </p>
                ) : null}

                {editUser.error ? (
                  <p className="font-mono text-[11px] text-red-400">
                    {extractError(editUser.error, "Couldn't update your profile.")}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                  <button
                    type="submit"
                    disabled={editUser.isPending}
                    className="inline-flex cursor-pointer items-center justify-center bg-[#fb923c] px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-[#0e0e0e] transition-colors hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {editUser.isPending ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
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
                    Delete account
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#777]">
                    Permanently remove your account, pulses, flairs, and stored
                    monitoring history.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteValue("");
                    setIsDeleteOpen(true);
                  }}
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
                Workspace summary
              </p>
              <div className="mt-5 space-y-4">
                <SummaryItem label="Email" value={user?.email || "—"} />
                <SummaryItem label="Provider" value={user?.provider || "github"} />
                <SummaryItem
                  label="Member since"
                  value={formatDate(user?.createdAt)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDeleteOpen ? (
        <DeleteAccountModal
          target={deleteTarget}
          confirmationValue={deleteValue}
          onConfirmationChange={setDeleteValue}
          onClose={() => setIsDeleteOpen(false)}
          onDelete={() => deleteUser.mutate()}
          canDelete={canDelete}
          isDeleting={deleteUser.isPending}
          errorMessage={extractError(deleteUser.error)}
        />
      ) : null}
    </AppLayout>
  );
}

function Field({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-[#f5f5f5]">{label}</p>
      <p className="mt-1 text-sm text-[#666]">{description}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-[#444]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm text-[#f5f5f5]">{value}</p>
    </div>
  );
}

function DeleteAccountModal({
  target,
  confirmationValue,
  onConfirmationChange,
  canDelete,
  isDeleting,
  errorMessage,
  onClose,
  onDelete,
}: {
  target: string;
  confirmationValue: string;
  onConfirmationChange: (value: string) => void;
  canDelete: boolean;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md border border-[rgba(245,245,245,0.08)] bg-[#111] p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
          Delete account
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
          This action is permanent
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
          Type <span className="text-[#f5f5f5]">{target}</span> to confirm
          account deletion.
        </p>

        <input
          type="text"
          value={confirmationValue}
          onChange={(event) => onConfirmationChange(event.target.value)}
          placeholder={target}
          className="mt-6 w-full border border-[rgba(245,245,245,0.14)] bg-[#161616] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] outline-none transition-colors focus:border-[#fb923c]"
        />

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete || isDeleting}
            className="inline-flex cursor-pointer items-center justify-center border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function extractError(error: unknown, fallback = "Something went wrong.") {
  const message =
    (error as any)?.response?.data?.message ?? (error as any)?.message;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return fallback;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
