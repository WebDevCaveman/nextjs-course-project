"use server";

import { CollectionBaseParams } from "@/types/action";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { Collection, Question } from "@/database";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";

export const toggleSaveQuestion = async (params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> => {
  const validationResult = await action({ params, schema: CollectionBaseSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError("User must be logged in")) as ErrorResponse;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new NotFoundError("Question");
    }

    const collection = await Collection.findOne({ question: questionId, author: userId });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);
      revalidatePath(ROUTES.QUESTION(questionId));
      return { success: true, data: { saved: false } };
    }

    await Collection.create({ question: questionId, author: userId });
    revalidatePath(ROUTES.QUESTION(questionId));
    return { success: true, data: { saved: true } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const hasSaved = async (params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> => {
  const validationResult = await action({ params, schema: CollectionBaseSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new UnauthorizedError("User must be logged in")) as ErrorResponse;

  try {
    const collection = await Collection.findOne({ question: questionId, author: userId });
    return { success: true, data: { saved: !!collection } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
