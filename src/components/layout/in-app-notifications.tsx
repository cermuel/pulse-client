type InAppNotification = {
  id: string;
  title: string;
  description: string;
  tone: "ping" | "danger" | "recovery";
  ctaLabel: string;
  onClick: () => void;
};

type InAppNotificationsProps = {
  notifications: InAppNotification[];
  onDismiss: (id: string) => void;
};

const toneClasses: Record<InAppNotification["tone"], string> = {
  ping: "border-[#fb923c]/30 bg-[#1a140d] text-[#f5f5f5]",
  danger: "border-red-500/30 bg-red-950/30 text-red-100",
  recovery: "border-green-500/30 bg-green-950/30 text-green-100",
};

const badgeClasses: Record<InAppNotification["tone"], string> = {
  ping: "bg-[#fb923c]",
  danger: "bg-red-500",
  recovery: "bg-green-500",
};

export function InAppNotifications({
  notifications,
  onDismiss,
}: InAppNotificationsProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto w-full border px-4 py-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 ${toneClasses[notification.tone]}`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${badgeClasses[notification.tone]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9a9a9a]">
                    Live update
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {notification.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-widest text-[#777] transition-colors hover:text-[#f5f5f5]"
                  aria-label="Dismiss notification"
                >
                  Close
                </button>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#bdbdbd]">
                {notification.description}
              </p>
              <button
                type="button"
                onClick={notification.onClick}
                className="mt-3 cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-[#fb923c] transition-colors hover:text-[#f5f5f5]"
              >
                {notification.ctaLabel} →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
