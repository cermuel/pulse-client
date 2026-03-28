import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "#/components/layout/app-layout";
import { AccountSettingsCard } from "#/components/ui/settings/account-settings-card";
import { DeleteAccountModal } from "#/components/ui/settings/delete-account-modal";
import { NotificationSettingsCard } from "#/components/ui/settings/notification-settings-card";
import { ProfileSummaryCard } from "#/components/ui/settings/profile-summary-card";
import { useUser, type Notification } from "#/context/useUser";
import api from "#/lib/api";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [name, setName] = useState("");
  const [notificationForm, setNotificationForm] = useState<Notification>({
    id: "",
    userId: "",
    email: false,
    inAppFlair: true,
    inAppPing: true,
    whatsapp: false,
    telegram: false,
  });
  const [deleteValue, setDeleteValue] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(true);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setNotificationForm(user.notification);
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

  const editNotifications = useMutation({
    mutationFn: async () => {
      const res = await api.patch("/notification", {
        email: notificationForm.email,
        inAppFlair: notificationForm.inAppFlair,
        inAppPing: notificationForm.inAppPing,
        whatsapp: notificationForm.whatsapp,
        telegram: notificationForm.telegram,
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
            <AccountSettingsCard
              name={name}
              email={user?.email}
              provider={user?.provider}
              isOpen={isAccountOpen}
              isPending={editUser.isPending}
              isSuccess={editUser.isSuccess}
              errorMessage={editUser.error ? extractError(editUser.error, "Couldn't update your profile.") : undefined}
              onToggleOpen={() => setIsAccountOpen((current) => !current)}
              onNameChange={setName}
              onSubmit={() => editUser.mutate()}
            />

            <div className="mt-4">
              <NotificationSettingsCard
                form={notificationForm}
                isFreePlan={user?.plan === "free"}
                isOpen={isNotificationsOpen}
                isPending={editNotifications.isPending}
                isSuccess={editNotifications.isSuccess}
                errorMessage={
                  editNotifications.error
                    ? extractError(
                        editNotifications.error,
                        "Couldn't update notification preferences.",
                      )
                    : undefined
                }
                onToggleOpen={() => setIsNotificationsOpen((current) => !current)}
                onToggle={(key, value) =>
                  setNotificationForm((current) => ({
                    ...current,
                    [key]: value,
                  }))
                }
                onSubmit={() => editNotifications.mutate()}
              />
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
            <ProfileSummaryCard user={user} />
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

function extractError(error: unknown, fallback = "Something went wrong.") {
  const message =
    (error as any)?.response?.data?.message ?? (error as any)?.message;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return fallback;
}
