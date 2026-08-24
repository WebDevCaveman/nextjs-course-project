import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import ROUTES from "@/constants/routes";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";

const EditQuestion = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) notFound();

  const session = await auth();
  if (!session) redirect(ROUTES.SIGN_IN);

  const { data: question, success } = await getQuestion({ questionId: id });

  if (!success) notFound();
  if (question?.author._id !== session?.user?.id) redirect(ROUTES.QUESTION(id));

  return (
    <>
      <h1>Edit Question</h1>
      <QuestionForm question={question} isEdit />
    </>
  );
};

export default EditQuestion;
