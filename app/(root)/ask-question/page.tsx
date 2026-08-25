import { auth } from "@/auth";
import { StateSkeleton } from "@/components/DataRenderer";
import QuestionForm from "@/components/forms/QuestionForm";
import { DEFAULT_DENIED } from "@/constants/states";

const AskQuestion = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <h1>Ask a Question</h1>
      {userId ? <QuestionForm /> : <StateSkeleton {...DEFAULT_DENIED} />}
    </>
  );
};

export default AskQuestion;
