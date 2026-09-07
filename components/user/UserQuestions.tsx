import { EMPTY_USER_QUESTIONS } from "@/constants/states";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import { DataRenderer } from "../DataRenderer";
import Pagination from "../pagination/Pagination";

const UserQuestions = async ({ userId, page, pageSize }: ProfileTabsParams) => {
  const { success, data, error } = await getUserQuestions({ userId, page, pageSize });
  const { questions, isNext } = data || {};

  return (
    <DataRenderer
      success={success}
      error={error}
      data={questions}
      empty={EMPTY_USER_QUESTIONS}
      render={(questions) => (
        <div className="flex flex-col gap-10">
          {questions.map((question) => (
            <QuestionCard key={question._id} {...question} />
          ))}
          <Pagination page={page} isNext={isNext || false} />
        </div>
      )}
    />
  );
};

export default UserQuestions;
