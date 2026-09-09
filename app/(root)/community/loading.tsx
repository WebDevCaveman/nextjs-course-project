import { Skeleton } from "@/components/ui/skeleton";
import { usersFilters } from "@/constants";

const CommunityLoading = () => {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[180px]" />
      </section>

      <Skeleton className="h-14 w-full rounded-xl" />

      <Skeleton className="h-[42px] w-full rounded-lg md:hidden" />
      <div className="hidden flex-wrap gap-3 md:flex">
        {usersFilters.map(({ value }) => (
          <Skeleton key={value} className="h-[42px] w-[90px] rounded-lg" />
        ))}
      </div>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(max(240px,calc((100%_-_3_*_1.5rem)_/_4)),1fr))] gap-6">
        {Array.from({ length: 10 }, (_, i) => (
          <article
            key={i}
            className="border-line bg-background shadow-card flex flex-col items-center gap-3.5 rounded-xl border p-5 md:p-9"
          >
            <Skeleton className="size-[100px] rounded-full" />

            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-[22px] w-[130px]" />
              <Skeleton className="h-[18px] w-[90px]" />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <Skeleton className="h-[29px] w-[84px] rounded-md" />
              <Skeleton className="h-[29px] w-[64px] rounded-md" />
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default CommunityLoading;
