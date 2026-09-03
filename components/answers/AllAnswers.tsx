import { Fragment } from "react";
import AnswerCard from "@/components/cards/AnswerCard";
import { Separator } from "@/components/ui/separator";
import PageFilter from "@/components/filters/PageFilter";
import { DataRenderer } from "@/components/DataRenderer";
import { EMPTY_ANSWERS } from "@/constants/states";
import { answersFilters } from "@/constants";
import { AnswerVotesResponse } from "@/types/action";
import Pagination from "../pagination/Pagination";

interface Props extends ActionResponse<Answer[]> {
  page: number;
  isNext: boolean;
  totalAnswers: number;
  // Jeden promise na cala strone odpowiedzi - powstaje w komponencie strony i tam tez
  // odpala jedno zapytanie do bazy. Brak promise'a (gosc) = zaden pasek glosowania.
  votesPromise?: Promise<ActionResponse<AnswerVotesResponse>>;
}

const AllAnswers = ({ page, isNext, success, error, data, totalAnswers, votesPromise }: Props) => {
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

                <AnswerCard
                  {...answer}
                  // .then() tworzy osobny promise dla kazdej karty, ale wszystkie wisza na tym
                  // samym, jednym zapytaniu - Votes dostaje ten sam ksztalt danych co przy pytaniu.
                  hasVotedPromise={votesPromise?.then((result) => ({
                    success: result.success,
                    data: {
                      hasUpvoted: result.data?.[answer._id] === "upvote",
                      hasDownvoted: result.data?.[answer._id] === "downvote",
                    },
                  }))}
                />
              </Fragment>
            ))}
            <Pagination page={page} isNext={isNext || false} />
          </div>
        )}
      />
    </section>
  );
};

export default AllAnswers;
