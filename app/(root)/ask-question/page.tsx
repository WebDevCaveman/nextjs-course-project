import { auth } from "@/auth";
import Blockade from "@/components/blockade/Blockade";
import QuestionForm from "@/components/forms/QuestionForm";

const AskQuestion = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <h1>Ask a Question</h1>
      {userId ? (
        <QuestionForm />
      ) : (
        <Blockade
          image="permission-denied"
          title="Sign in to ask a question"
          description={"You need an account to post a question.\nSign in or create one — it only takes a minute."}
        />
      )}
    </>
  );
};

export default AskQuestion;
