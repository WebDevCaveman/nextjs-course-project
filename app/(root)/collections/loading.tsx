import QuestionCardSkeleton from "@/components/cards/QuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { collectionsFilters } from "@/constants";

const CollectionsLoading = () => {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[240px]" />
      </section>

      <Skeleton className="h-14 w-full rounded-xl" />

      <Skeleton className="h-[42px] w-full rounded-lg md:hidden" />
      <div className="hidden flex-wrap gap-3 md:flex">
        {collectionsFilters.map(({ value }) => (
          <Skeleton key={value} className="h-[42px] w-[110px] rounded-lg" />
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

export default CollectionsLoading;
