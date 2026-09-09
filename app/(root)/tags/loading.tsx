import { Skeleton } from "@/components/ui/skeleton";
import { tagsFilters } from "@/constants";

const TagsLoading = () => {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[100px]" />
      </section>

      <Skeleton className="h-14 w-full rounded-xl" />

      <Skeleton className="h-[42px] w-full rounded-lg md:hidden" />
      <div className="hidden flex-wrap gap-3 md:flex">
        {tagsFilters.map(({ value }) => (
          <Skeleton key={value} className="h-[42px] w-[100px] rounded-lg" />
        ))}
      </div>

      <section className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <article
            key={i}
            className="border-line bg-background shadow-card flex flex-col gap-3.5 rounded-xl border p-5 md:p-9"
          >
            <Skeleton className="h-[37px] w-[130px] rounded-sm" />

            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-[18px] w-full" />
              <Skeleton className="h-[18px] w-full" />
              <Skeleton className="h-[18px] w-2/3" />
            </div>

            <Skeleton className="h-[18px] w-24" />
          </article>
        ))}
      </section>
    </>
  );
};

export default TagsLoading;
