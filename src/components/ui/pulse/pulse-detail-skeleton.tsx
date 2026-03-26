import { Skeleton } from "#/components/shared/skeleton";

export function PulseDetailSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-3 h-3 w-24 rounded-none" />
        <Skeleton className="mb-2 h-8 w-64 rounded-none" />
        <Skeleton className="h-3 w-48 rounded-none" />
      </div>
      <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
            <Skeleton className="mb-3 h-2.5 w-20 rounded-none" />
            <Skeleton className="h-7 w-12 rounded-none" />
          </div>
        ))}
      </div>
      <div className="mb-8 border border-[#1f1f1f] bg-[#111] px-6 py-5">
        <Skeleton className="mb-4 h-2.5 w-20 rounded-none" />
        <Skeleton className="h-10 w-full rounded-none" />
      </div>
    </div>
  );
}
