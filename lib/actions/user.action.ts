"use server";

import { QueryFilter } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchParamsSchema } from "../validations";
import { escapeRegExp } from "../utils";
import { User } from "@/database";
import { usersFilters } from "@/constants";

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
