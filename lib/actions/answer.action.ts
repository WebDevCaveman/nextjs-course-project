"use server";

import { CreateAnswerParams, GetAnswersParams } from "@/types/action";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { AnswerServerSchema, GetAnswersSchema } from "../validations";
import mongoose from "mongoose";
import { Answer, Question } from "@/database";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";
import { IUserDoc } from "@/database/user.model";

export const createAnswer = async (params: CreateAnswerParams): Promise<ActionResponse<Answer>> => {
  const validationResult = await action({ params, schema: AnswerServerSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, content } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).session(session);

    if (!question) throw new Error("Question not found.");

    const [answer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      { session }
    );

    if (!answer) throw new Error("Failed to create answer.");

    question.answers += 1;
    await question.save({ session });

    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const getAnswers = async (
  params: GetAnswersParams
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean; totalAnswers: number }>> => {
  const validationResult = await action({ params, schema: GetAnswersSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId, page = 1, pageSize = 10, filter } = validationResult.params!;
  const skip = (page - 1) * pageSize;
  let sortCriteria = {};

  switch (filter) {
    case "latest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const [answers, totalAnswers] = await Promise.all([
      Answer.find({ question: questionId })
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageSize)
        .populate<{ author: IUserDoc }>("author", "_id name image")
        .lean(),
      Answer.countDocuments({ question: questionId }),
    ]);

    const isNext = totalAnswers > page * pageSize;
    return { success: true, data: { answers: JSON.parse(JSON.stringify(answers)), isNext, totalAnswers } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
