"use server";

import { CreateInteractionParams } from "@/types/action";
import { UnauthorizedError } from "../http-errors";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CreateInteractionSchema } from "../validations";
import mongoose from "mongoose";
import Interaction from "@/database/interaction.model";
import { updateUserReputation } from "./user.action";
import { isScoredInteraction } from "@/constants/interactions";

export const createInteraction = async (params: CreateInteractionParams): Promise<ActionResponse> => {
  const validationResult = await action({ params, schema: CreateInteractionSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { action: interactionAction, actionTarget, actionId, authorId, query } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError()) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const res = await Interaction.updateOne(
      { user: userId, action: interactionAction, actionId, query },
      { $setOnInsert: { actionType: actionTarget } },
      { upsert: true, session }
    );

    if (res.upsertedCount === 0) {
      await session.commitTransaction();
      return { success: true };
    }

    if (isScoredInteraction(interactionAction)) {
      await updateUserReputation(
        {
          userId,
          authorId: authorId === userId ? undefined : authorId,
          interaction: interactionAction,
        },
        session
      );
    }

    await session.commitTransaction();
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};
