"use server";

import { ClientSession, Types, type PipelineStage, type QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetUserQuestionsAndAnswersSchema,
  GetUserDetailsSchema,
  PaginatedSearchParamsSchema,
  EditProfileSchema,
} from "../validations";
import { assignBadges, escapeRegExp } from "../utils";
import { User, Question, Answer } from "@/database";
import { usersFilters } from "@/constants";
import {
  GetUserDetailsParams,
  GetUserQuestionsAndAnswersParams,
  UpdateUserParams,
  UpdateUserReputationParams,
} from "@/types/action";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";
import { NotFoundError } from "../http-errors";
import { ITagDoc } from "@/database/tag.model";
import { IUserDoc } from "@/database/user.model";
import { INTERACTIONS_POINTS } from "@/constants/interactions";

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

export const getUser = async (params: GetUserDetailsParams): Promise<ActionResponse<{ user: User }>> => {
  const validationResult = await action({ params, schema: GetUserDetailsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId).lean();
    if (!user) throw new NotFoundError("User");

    return { success: true, data: { user: JSON.parse(JSON.stringify(user)) } };
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
    // Trzy niezalezne zapytania - sekwencyjnie to trzy round tripy do bazy zamiast
    // jednego. Sprawdzenie istnienia zostaje, bo to Server Action: da sie ja wywolac
    // z dowolnym userId, nie tylko przez strone profilu, ktora juz zrobila getUser.
    const [user, totalQuestions, questions] = await Promise.all([
      User.exists({ _id: userId }),
      Question.countDocuments({ author: userId }),
      Question.find({ author: userId })
        .populate<{ tags: ITagDoc[] }>("tags", "name")
        .populate<{ author: IUserDoc }>("author", "name image")
        .sort({ upvotes: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    if (!user) throw new NotFoundError("User");

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
    const [user, totalAnswers, answers] = await Promise.all([
      User.exists({ _id: userId }),
      Answer.countDocuments({ author: userId }),
      Answer.find({ author: userId })
        .populate<{ question: Pick<Question, "_id" | "title"> }>("question", "_id title")
        .populate<{ author: IUserDoc }>("author", "_id name image")
        .sort({ upvotes: -1, _id: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
    ]);

    if (!user) throw new NotFoundError("User");

    const isNext = totalAnswers > skip + answers.length;

    return { success: true, data: { answers: JSON.parse(JSON.stringify(answers)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getUserTags = async (
  params: GetUserDetailsParams
): Promise<ActionResponse<{ tags: { _id: string; name: string; count: number }[] }>> => {
  const validationResult = await action({ params, schema: GetUserDetailsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $project: { _id: "$tagInfo._id", name: "$tagInfo.name", count: 1 } },
    ];

    const [user, tags] = await Promise.all([User.exists({ _id: userId }), Question.aggregate(pipeline)]);

    if (!user) throw new NotFoundError("User");

    return { success: true, data: { tags: JSON.parse(JSON.stringify(tags)) } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const updateUserReputation = async (
  params: UpdateUserReputationParams,
  session?: ClientSession
): Promise<void> => {
  if (!session) throw new Error("Client session is required");

  const { userId, authorId, interaction } = params;

  await User.updateOne({ _id: userId }, { $inc: { reputation: INTERACTIONS_POINTS[interaction].user } }, { session });

  if (authorId)
    await User.updateOne(
      { _id: authorId },
      { $inc: { reputation: INTERACTIONS_POINTS[interaction].author } },
      { session }
    );
};

export async function getUserStats(params: GetUserDetailsParams): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: Badges;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserDetailsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = validationResult.params!;

  try {
    const [questionStats = { count: 0, upvotes: 0, views: 0 }] = await Question.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          views: { $sum: "$views" },
        },
      },
    ]);

    const [answerStats = { count: 0, upvotes: 0 }] = await Answer.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const badges = assignBadges({
      criteria: [
        { type: "ANSWER_COUNT", count: answerStats.count },
        { type: "QUESTION_COUNT", count: questionStats.count },
        { type: "QUESTION_UPVOTES", count: questionStats.upvotes },
        { type: "ANSWER_UPVOTES", count: answerStats.upvotes },
        { type: "TOTAL_VIEWS", count: questionStats.views },
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionStats.count,
        totalAnswers: answerStats.count,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export const updateUser = async (params: UpdateUserParams): Promise<ActionResponse<User>> => {
  const validationResult = await action({ params, schema: EditProfileSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session!.user!.id!;

  try {
    const user = await User.findByIdAndUpdate(userId, validationResult.params!, { new: true }).lean();
    if (!user) throw new NotFoundError("User");

    revalidatePath(ROUTES.PROFILE(userId));

    return { success: true, data: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
