import { auth } from "@/auth";
import AnswerForm from "@/components/forms/AnswerForm";
import ROUTES from "@/constants/routes";
import { getAnswer } from "@/lib/actions/answer.action";
import { notFound, redirect } from "next/navigation";

const EditAnswer = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const session = await auth();
  if (!session) redirect(ROUTES.SIGN_IN);

  const { data: answer, success } = await getAnswer({ answerId: id });

  if (!success || !answer) notFound();
  if (answer.author._id !== session.user?.id) redirect(ROUTES.QUESTION(answer.question._id));

  return (
    <>
      <h1>Edit Answer</h1>
      <AnswerForm
        questionId={answer.question._id}
        questionTitle={answer.question.title}
        questionContent={answer.question.content}
        answer={answer}
        isEdit
      />
    </>
  );
};

export default EditAnswer;
