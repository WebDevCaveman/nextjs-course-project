"use server";

import {
  AnswerVotesResponse,
  CreateVoteParams,
  GetAnswerVotesParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types/action";
import action from "../handlers/action";
import { CreateVoteSchema, GetAnswerVotesSchema, HasVotedSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose, { ClientSession } from "mongoose";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { Question, Answer, Vote } from "@/database";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";

const updateVoteCount = async (params: UpdateVoteCountParams, session?: ClientSession): Promise<void> => {
  const { targetId, targetType, voteType, change } = params;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  const update = { $inc: { [voteField]: change } };
  const opts = { new: true, session };
  const result =
    targetType === "question"
      ? await Question.findByIdAndUpdate(targetId, update, opts)
      : await Answer.findByIdAndUpdate(targetId, update, opts);

  if (!result) throw new Error("Failed to update vote count");
};

export const createVote = async (params: CreateVoteParams): Promise<ActionResponse> => {
  const validationResult = await action({ params, schema: CreateVoteSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError("User must be logged in to vote")) as ErrorResponse;

  let questionId = targetId;
  if (targetType === "question") {
    const question = await Question.exists({ _id: targetId });
    if (!question) return handleError(new NotFoundError("Question")) as ErrorResponse;
  } else {
    const answer = await Answer.findById(targetId);
    if (!answer) return handleError(new NotFoundError("Answer")) as ErrorResponse;
    questionId = answer.question.toString();
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({ author: userId, id: targetId, type: targetType }).session(session);
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If the existing vote is the same as the new vote type, remove the vote
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount({ targetId, targetType, voteType, change: -1 }, session);
      } else {
        // If the existing vote is different, update the vote type
        await Vote.updateOne({ _id: existingVote._id }, { voteType }).session(session);
        await updateVoteCount({ targetId, targetType, voteType: existingVote.voteType, change: -1 }, session);
        await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            id: targetId,
            type: targetType,
            voteType,
          },
        ],
        { session }
      );
      await updateVoteCount({ targetId, targetType, voteType, change: 1 }, session);
    }

    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const hasVoted = async (params: HasVotedParams): Promise<ActionResponse<HasVotedResponse>> => {
  const validationResult = await action({ params, schema: HasVotedSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError("User must be logged in")) as ErrorResponse;

  try {
    const vote = await Vote.findOne({ author: userId, id: targetId, type: targetType });
    if (!vote) {
      return { success: true, data: { hasUpvoted: false, hasDownvoted: false } };
    }

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

// hasVoted pyta o jeden target, wiec lista odpowiedzi generowalaby jedno zapytanie na kazda karte
// (10 odpowiedzi = 10 x Vote.findOne + 10 x auth()). Ta akcja pobiera glosy uzytkownika dla calej
// strony odpowiedzi jednym zapytaniem i zwraca mape, z ktorej kazda karta wyluskuje swoj wpis.
export const getAnswerVotes = async (params: GetAnswerVotesParams): Promise<ActionResponse<AnswerVotesResponse>> => {
  const validationResult = await action({ params, schema: GetAnswerVotesSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerIds } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError("User must be logged in")) as ErrorResponse;

  try {
    // Filtr trafia dokladnie w indeks zlozony { author, id, type } z modelu Vote.
    // Wracaja tylko te odpowiedzi, na ktore uzytkownik faktycznie zaglosowal - zwykle garstka albo zero.
    const votes = await Vote.find({ author: userId, type: "answer", id: { $in: answerIds } })
      .select("id voteType")
      .lean();

    return {
      success: true,
      data: Object.fromEntries(votes.map((vote) => [vote.id.toString(), vote.voteType])),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
