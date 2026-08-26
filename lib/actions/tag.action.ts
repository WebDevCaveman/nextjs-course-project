import { Tag } from "@/database";
import { ITag, ITagDoc } from "@/database/tag.model";
import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { escapeRegExp } from "../utils";
import { PaginatedSearchParamsSchema, GetTagQuestionsSchema } from "../validations";
import { GetTagQuestionsParams } from "@/types/action";
import { NotFoundError } from "../http-errors";
import Question, { IQuestion } from "@/database/question.model";
import { IUserDoc } from "@/database/user.model";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: PaginatedSearchParamsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;

  const filterQuery: QueryFilter<ITag> = {};
  const skip = (page - 1) * pageSize;

  if (query) {
    const search = escapeRegExp(query);
    filterQuery.$or = [{ name: { $regex: search, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name_asc":
      sortCriteria = { name: 1 };
      break;
    case "name_desc":
      sortCriteria = { name: -1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery).sort(sortCriteria).skip(skip).limit(pageSize).lean();

    const isNext = totalTags > skip + tags.length;

    return { success: true, data: { tags: JSON.parse(JSON.stringify(tags)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getTagQuestions = async (
  params: GetTagQuestionsParams
): Promise<ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: GetTagQuestionsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, tagId } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new NotFoundError("Tag");

    const filterQuery: QueryFilter<IQuestion> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      const search = escapeRegExp(query);
      filterQuery.title = { $regex: search, $options: "i" };
    }
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author tags createdAt")
      .populate<{ author: IUserDoc }>("author", "name image")
      .populate<{ tags: ITagDoc[] }>("tags", "name")
      .skip(skip)
      .limit(pageSize)
      .lean();

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { tag: JSON.parse(JSON.stringify(tag)), questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
