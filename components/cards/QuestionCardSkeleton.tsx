import { Skeleton } from "@/components/ui/skeleton";

const QuestionCardSkeleton = () => {
  return (
    <article className="border-line bg-background shadow-card flex flex-col gap-6 rounded-xl border p-5 md:p-9">
      <Skeleton className="h-6 w-3/4" />

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-sm" />
        <Skeleton className="h-6 w-16 rounded-sm" />
        <Skeleton className="h-6 w-24 rounded-sm" />
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-[21px] w-24" />
          <Skeleton className="h-[18px] w-28" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-[18px] w-16" />
          <Skeleton className="h-[18px] w-20" />
          <Skeleton className="h-[18px] w-16" />
        </div>
      </footer>
    </article>
  );
};

export default QuestionCardSkeleton;
