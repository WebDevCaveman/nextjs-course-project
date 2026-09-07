import { EMPTY_USER_ANSWERS } from "@/constants/states";
import { getUserAnswers } from "@/lib/actions/user.action";
import { DataRenderer } from "../DataRenderer";
import Pagination from "../pagination/Pagination";
import AnswerCard from "../cards/AnswerCard";
import { Fragment } from "react";
import { Separator } from "../ui/separator";

const UserAnswers = async ({ userId, page, pageSize }: ProfileTabsParams) => {
  const { success, data, error } = await getUserAnswers({ userId, page, pageSize });
  const { answers, isNext } = data || {};

  return (
    <DataRenderer
      success={success}
      error={error}
      data={answers}
      empty={EMPTY_USER_ANSWERS}
      render={(answers) => (
        <div className="flex flex-col gap-10">
          {answers.map((answer, index) => (
            <Fragment key={answer._id}>
              {index > 0 && <Separator />}

              <AnswerCard {...answer} lineClamp={2} showActionBtns={userId === answer.author._id} />
            </Fragment>
          ))}
          <Pagination page={page} isNext={isNext || false} />
        </div>
      )}
    />
  );
};

export default UserAnswers;
