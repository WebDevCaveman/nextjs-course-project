import { EMPTY_USER_QUESTIONS } from "@/constants/states";
import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import { DataRenderer } from "../DataRenderer";
import Pagination from "../pagination/Pagination";
import { auth } from "@/auth";

const UserQuestions = async ({ userId, page, pageSize }: ProfileTabsParams) => {
  const { success, data, error } = await getUserQuestions({ userId, page, pageSize });
  const { questions, isNext } = data || {};
  const session = await auth();
  const loggedInUserId = session?.user?.id;

  return (
    <DataRenderer
      success={success}
      error={error}
      data={questions}
      empty={EMPTY_USER_QUESTIONS}
      render={(questions) => (
        <div className="flex flex-col gap-10">
          {questions.map((question) => (
            <QuestionCard key={question._id} {...question} showActionBtns={loggedInUserId === question.author._id} />
          ))}
          <Pagination page={page} isNext={isNext || false} />
        </div>
      )}
    />
  );
};

export default UserQuestions;
