import { Skeleton } from "@/components/ui/skeleton";

const QuestionDetailsLoading = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-[21px] w-32" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-[30px] w-14 rounded-md" />
            <Skeleton className="h-[30px] w-14 rounded-md" />
            <Skeleton className="size-[18px] rounded-sm" />
          </div>
        </div>

        <Skeleton className="h-[38px] w-4/5" />

        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-[18px] w-32" />
          <Skeleton className="h-[18px] w-16" />
          <Skeleton className="h-[18px] w-20" />
          <Skeleton className="h-[18px] w-16" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-[21px] w-full" />
        <Skeleton className="h-[21px] w-full" />
        <Skeleton className="h-[21px] w-11/12" />
        <Skeleton className="h-[21px] w-2/3" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-sm" />
        <Skeleton className="h-6 w-16 rounded-sm" />
        <Skeleton className="h-6 w-24 rounded-sm" />
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-[42px] w-[140px] rounded-lg" />
        </div>

        {Array.from({ length: 2 }, (_, i) => (
          <article key={i} className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-12">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-[21px] w-28" />
                <Skeleton className="h-[18px] w-32" />
              </div>
              <Skeleton className="h-[30px] w-[120px] rounded-md" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-[21px] w-full" />
              <Skeleton className="h-[21px] w-5/6" />
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default QuestionDetailsLoading;
