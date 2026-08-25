import { Tag } from "@/database";
import { ITag } from "@/database/tag.model";
import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { escapeRegExp } from "../utils";
import { PaginatedSearchParamsSchema } from "../validations";

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
