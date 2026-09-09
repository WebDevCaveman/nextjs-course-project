"use server";

import {
  CreateAnswerParams,
  DeleteAnswerParams,
  EditAnswerParams,
  GetAnswerParams,
  GetAnswersParams,
} from "@/types/action";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  AnswerServerSchema,
  DeleteAnswerSchema,
  EditAnswerSchema,
  GetAnswerSchema,
  GetAnswersSchema,
} from "../validations";
import mongoose from "mongoose";
import { Answer, Interaction, Question, Vote } from "@/database";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";
import { IUserDoc } from "@/database/user.model";
import { answersFilters } from "@/constants";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { createInteraction } from "./interaction.action";
import { after } from "next/server";

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

    after(async () => {
      await createInteraction({
        action: "answer_post",
        actionTarget: "answer",
        actionId: answer._id.toString(),
        authorId: question.author.toString(),
      });
    });

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
    case answersFilters[0].value: // "latest"
      sortCriteria = { createdAt: -1 };
      break;
    case answersFilters[1].value: // "oldest"
      sortCriteria = { createdAt: 1 };
      break;
    case answersFilters[2].value: // "popular"
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

export const deleteAnswer = async (params: DeleteAnswerParams): Promise<ActionResponse> => {
  const validationResult = await action({ params, schema: DeleteAnswerSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const answer = await Answer.findById(answerId).session(session);

    if (!answer) throw new NotFoundError("Answer");
    if (answer.author._id.toString() !== userId) throw new UnauthorizedError();

    const question = await Question.findByIdAndUpdate(answer.question, { $inc: { answers: -1 } }, { session });

    await Vote.deleteMany({ id: answerId, type: "answer" }, { session });
    await Interaction.deleteMany({ actionId: answerId, actionType: "answer" }, { session });
    await answer.deleteOne({ session });

    await session.commitTransaction();

    after(async () => {
      await createInteraction({
        action: "answer_delete",
        actionTarget: "answer",
        actionId: answerId,
        authorId: question?.author.toString(),
      });
    });

    revalidatePath(ROUTES.PROFILE(userId));
    if (question) revalidatePath(ROUTES.QUESTION(question._id.toString()));

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const getAnswer = async (params: GetAnswerParams): Promise<ActionResponse<AnswerWithQuestion>> => {
  const validationResult = await action({ params, schema: GetAnswerSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;

  try {
    // Pytanie doczytujemy razem z trescia, bo formularz edycji karmi nia "Enhance with AI".
    const answer = await Answer.findById(answerId)
      .populate("question", "_id title content")
      .populate<{ author: IUserDoc }>("author", "_id name image")
      .lean();

    if (!answer) throw new NotFoundError("Answer");

    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const editAnswer = async (params: EditAnswerParams): Promise<ActionResponse<Answer>> => {
  const validationResult = await action({ params, schema: EditAnswerSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId, content } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  try {
    const answer = await Answer.findById(answerId);

    if (!answer) throw new NotFoundError("Answer");
    if (answer.author.toString() !== userId) throw new UnauthorizedError();

    answer.content = content;
    await answer.save();

    const questionId = answer.question.toString();
    revalidatePath(ROUTES.QUESTION(questionId));
    revalidatePath(ROUTES.PROFILE(userId));

    after(async () => {
      await createInteraction({
        action: "edit",
        actionTarget: "answer",
        actionId: answerId,
      });
    });

    return { success: true, data: JSON.parse(JSON.stringify(answer)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
