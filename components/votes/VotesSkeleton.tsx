import { Skeleton } from "@/components/ui/skeleton";

const VotesSkeleton = () => {
  return (
    <div className="flex items-center gap-1">
      <Skeleton className="h-[30px] w-14 rounded-md" />
      <Skeleton className="h-[30px] w-14 rounded-md" />
    </div>
  );
};

export default VotesSkeleton;
