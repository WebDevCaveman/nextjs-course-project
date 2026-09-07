"use server";

import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { GetUserQuestionsAndAnswersSchema, GetUserSchema, PaginatedSearchParamsSchema } from "../validations";
import { escapeRegExp } from "../utils";
import { User, Question, Answer } from "@/database";
import { usersFilters } from "@/constants";
import { getUserParams, GetUserQuestionsAndAnswersParams } from "@/types/action";
import { NotFoundError } from "../http-errors";
import { ITagDoc } from "@/database/tag.model";
import { IUserDoc } from "@/database/user.model";

export const getUsers = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: PaginatedSearchParamsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  const filterQuery: QueryFilter<typeof User> = {};

  if (query) {
    const search = escapeRegExp(query);
    filterQuery.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case usersFilters[0].value: // "newest"
      sortCriteria = { createdAt: -1 };
      break;
    case usersFilters[1].value: // "oldest"
      sortCriteria = { createdAt: 1 };
      break;
    case usersFilters[2].value: // "popular"
      sortCriteria = { reputation: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(pageSize).lean();

    const isNext = totalUsers > skip + users.length;

    return { success: true, data: { users: JSON.parse(JSON.stringify(users)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUser = async (
  params: getUserParams
): Promise<ActionResponse<{ user: User; totalQuestions: number; totalAnswers: number }>> => {
  const validationResult = await action({ params, schema: GetUserSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId).lean();
    if (!user) throw new NotFoundError("User");

    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });

    return { success: true, data: { user: JSON.parse(JSON.stringify(user)), totalQuestions, totalAnswers } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserQuestions = async (
  params: GetUserQuestionsAndAnswersParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: GetUserQuestionsAndAnswersSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  try {
    const user = await User.findById(userId).lean();
    if (!user) throw new NotFoundError("User");

    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate<{ tags: ITagDoc[] }>("tags", "name")
      .populate<{ author: IUserDoc }>("author", "name image")
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const isNext = totalQuestions > skip + questions.length;

    return { success: true, data: { questions: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserAnswers = async (
  params: GetUserQuestionsAndAnswersParams
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: GetUserQuestionsAndAnswersSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId, page = 1, pageSize = 10 } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  try {
    const user = await User.findById(userId).lean();
    if (!user) throw new NotFoundError("User");

    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate<{ question: Question }>("question", "_id title")
      .populate<{ author: IUserDoc }>("author", "_id name image")
      .sort({ upvotes: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const isNext = totalAnswers > skip + answers.length;

    return { success: true, data: { answers: JSON.parse(JSON.stringify(answers)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
