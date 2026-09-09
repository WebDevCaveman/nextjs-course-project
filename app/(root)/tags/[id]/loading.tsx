import QuestionCardSkeleton from "@/components/cards/QuestionCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const TagQuestionsLoading = () => {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[160px]" />
      </section>

      <Skeleton className="h-14 w-full rounded-xl" />

      <section className="grid gap-10 min-[1920px]:grid-cols-2">
        {Array.from({ length: 5 }, (_, i) => (
          <QuestionCardSkeleton key={i} />
        ))}
      </section>
    </>
  );
};

export default TagQuestionsLoading;
