import QuestionCardSkeleton from "@/components/cards/QuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const statCell = "border-line bg-background shadow-card rounded-xl border p-4";

const ProfileLoading = () => {
  return (
    <>
      <section className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
        <Skeleton className="size-[110px] shrink-0 rounded-full lg:size-[180px]" />

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-[38px] w-[240px]" />
            <Skeleton className="h-[21px] w-[140px]" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-[18px] w-28" />
            <Skeleton className="h-[18px] w-24" />
            <Skeleton className="h-[18px] w-32" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-[21px] w-full" />
            <Skeleton className="h-[21px] w-4/5" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <Skeleton className="h-6 w-16" />

        <div className="flex flex-wrap gap-3">
          <div className={`${statCell} flex flex-col items-center justify-center gap-1.5`}>
            <Skeleton className="size-5" />
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-[18px] w-20" />
          </div>

          <div className={`${statCell} grid flex-1 basis-[210px] grid-cols-2 gap-3`}>
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1.5">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-[18px] w-20" />
              </div>
            ))}
          </div>

          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={`${statCell} flex flex-1 basis-[210px] items-center gap-3`}>
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-7 w-10" />
                <Skeleton className="h-[18px] w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-10">
          <Skeleton className="h-[52px] w-[260px] rounded-2xl" />

          {Array.from({ length: 3 }, (_, i) => (
            <QuestionCardSkeleton key={i} />
          ))}
        </div>

        <div className="lg:w-[330px] lg:shrink-0">
          <section className="flex flex-col gap-4">
            <Skeleton className="h-[22px] w-24" />

            <ul className="flex list-none flex-col gap-3.5 pl-0">
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-28 rounded-sm" />
                  <Skeleton className="ml-auto h-[18px] w-8" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProfileLoading;
