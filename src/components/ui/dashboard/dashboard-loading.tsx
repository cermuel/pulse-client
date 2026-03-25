import { Skeleton } from "#/components/shared/skeleton";

const DashboardLoading = () => {
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#1f1f1f] bg-[#111] px-5 py-4">
            <Skeleton className="h-2.5 w-20 rounded-none" />
            <Skeleton className="mt-3 h-8 w-12 rounded-none" />
          </div>
        ))}
      </div>

      <div className="border border-[#1f1f1f]">
        <div className="border-b border-[#1f1f1f] px-6 py-4">
          <Skeleton className="h-2.5 w-16 rounded-none" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 border-b border-[#1a1a1a] px-6 py-4"
          >
            <Skeleton className="h-3 w-24 rounded-none" />
            <Skeleton className="h-3 w-48 rounded-none" />
            <Skeleton className="h-3 w-12 rounded-none" />
            <Skeleton className="h-3 w-10 rounded-none" />
            <Skeleton className="h-3 w-14 rounded-none" />
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardLoading;
