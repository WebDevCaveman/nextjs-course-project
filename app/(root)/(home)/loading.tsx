import QuestionCardSkeleton from "@/components/cards/QuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { homeFilters } from "@/constants";

const HomeLoading = () => {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[220px]" />
        <Skeleton className="h-[45px] w-[170px] rounded-[11px]" />
      </section>

      <Skeleton className="h-14 w-full rounded-xl" />

      <Skeleton className="h-[42px] w-full rounded-lg md:hidden" />
      <div className="hidden flex-wrap gap-3 md:flex">
        {homeFilters.map(({ value }) => (
          <Skeleton key={value} className="h-[42px] w-[100px] rounded-lg" />
        ))}
      </div>

      <section className="grid gap-10 min-[1920px]:grid-cols-2">
        {Array.from({ length: 5 }, (_, i) => (
          <QuestionCardSkeleton key={i} />
        ))}
      </section>
    </>
  );
};

export default HomeLoading;
