import { Fragment } from "react";
import AnswerCard from "@/components/cards/AnswerCard";
import { Separator } from "@/components/ui/separator";
import PageFilter from "@/components/filters/PageFilter";
import { DataRenderer } from "@/components/DataRenderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import { answersFilters } from "@/constants";

interface AllAnswersProps {
  success: boolean;
  error?: {
    message?: string;
    details?: Record<string, string[]>;
  };
  data: Answer[] | null | undefined;
  totalAnswers: number;
}

const AllAnswers = ({ success, error, data, totalAnswers }: AllAnswersProps) => {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2>
          <span className="text-accent-solid">{totalAnswers}</span> {totalAnswers === 1 ? "Answer" : "Answers"}
        </h2>
        <PageFilter filters={answersFilters} variant="select" />
      </div>

      <Separator />

      <DataRenderer
        success={success}
        error={error}
        data={data}
        empty={EMPTY_ANSWERS}
        render={(answers) => (
          <div className="flex flex-col gap-6">
            {answers.map((answer, index) => (
              <Fragment key={answer._id}>
                {/* Linia rozdziela odpowiedzi, wiec rysujemy ja przed kazda kolejna - ostatnia jej nie dostaje */}
                {index > 0 && <Separator />}

                <AnswerCard {...answer} />
              </Fragment>
            ))}
          </div>
        )}
      />
    </section>
  );
};

export default AllAnswers;
