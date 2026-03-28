import type { User } from "#/context/useUser";

type ProfileSummaryCardProps = {
  user?: User;
};

export function ProfileSummaryCard({ user }: ProfileSummaryCardProps) {
  return (
    <>
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
          <SummaryItem label="Member since" value={formatDate(user?.createdAt)} />
        </div>
      </div>
    </>
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

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
