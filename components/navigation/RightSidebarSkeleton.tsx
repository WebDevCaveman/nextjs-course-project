import { Skeleton } from "@/components/ui/skeleton";

const RightSidebarSkeleton = () => {
  return (
    <div className="border-line bg-background sticky top-16 hidden h-[calc(100vh-4rem)] w-[350px] shrink-0 flex-col gap-9 overflow-y-auto border-l p-6 xl:flex">
      <section className="flex flex-col gap-4">
        <Skeleton className="h-[22px] w-32" />

        <ul className="flex list-none flex-col gap-3.5 pl-0">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="flex items-center gap-3.5">
              <Skeleton className="size-[22px] shrink-0 rounded-[4px]" />
              <Skeleton className="h-[21px] flex-1" />
            </li>
          ))}
        </ul>
      </section>

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
  );
};

export default RightSidebarSkeleton;
