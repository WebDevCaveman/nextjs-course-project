"use server";

import { Model } from "mongoose";

import { Answer, Question, Tag, User } from "@/database";
import { GlobalSearchParams } from "@/types/action";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { escapeRegExp } from "../utils";
import { GlobalSearchSchema } from "../validations";

const searchTargets = [
  { model: Question, searchField: "title", type: "question" },
  { model: User, searchField: "name", type: "user" },
  { model: Answer, searchField: "content", type: "answer" },
  { model: Tag, searchField: "name", type: "tag" },
] as const;

export const globalSearch = async (params: GlobalSearchParams): Promise<ActionResponse<GlobalSearchResult[]>> => {
  const validationResult = await action({ params, schema: GlobalSearchSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { query, type } = validationResult.params!;

  const regexQuery = { $regex: escapeRegExp(query), $options: "i" };
  const targets = type ? searchTargets.filter((target) => target.type === type) : searchTargets;
  const limit = type ? 8 : 2;

  try {
    const results = await Promise.all(
      targets.map(async ({ model, searchField, type: resultType }) => {
        const documents = await (model as unknown as Model<Record<string, unknown>>)
          .find({ [searchField]: regexQuery })
          .limit(limit)
          .lean();

        return documents.map((document) => ({
          type: resultType,
          title: resultType === "answer" ? `Answers containing "${query}"` : String(document[searchField]),
          id: String(resultType === "answer" ? document.question : document._id),
        }));
      })
    );

    return { success: true, data: results.flat() };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
