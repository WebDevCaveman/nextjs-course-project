"use server";

import { CollectionBaseParams } from "@/types/action";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { Collection, Question } from "@/database";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import ROUTES from "@/constants/routes";
import { revalidatePath } from "next/cache";
import { PaginatedSearchParamsSchema } from "../validations";
import { collectionsFilters } from "@/constants";
import mongoose, { PipelineStage } from "mongoose";
import { escapeRegExp } from "../utils";

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

export const getSavedQuestions = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collections: Collection[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: PaginatedSearchParamsSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new UnauthorizedError("User must be logged in")) as ErrorResponse;

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const skip = (page - 1) * pageSize;

  let sortCriteria = {};

  switch (filter) {
    case collectionsFilters[0].value: // "most_recent"
      sortCriteria = { "question.createdAt": -1 };
      break;
    case collectionsFilters[1].value: // "oldest"
      sortCriteria = { "question.createdAt": 1 };
      break;
    case collectionsFilters[2].value: // "most_voted"
      sortCriteria = { "question.upvotes": -1 };
      break;
    case collectionsFilters[3].value: // "most_viewed"
      sortCriteria = { "question.views": -1 };
      break;
    case collectionsFilters[4].value: // "most_answered"
      sortCriteria = { "question.answers": -1 };
      break;
    default:
      sortCriteria = { "question.createdAt": -1 };
  }

  // W tym przypadku korzystamy z pipeline, aby móc filtrować, sortować i paginować kolekcje w jednym zapytaniu do bazy danych. Dzięki temu możemy uniknąć wielu zapytań i zoptymalizować wydajność. Musimy to zrobić poniewaz w tym przypadku nie operujemy bezposrednio na Questions, ale na Collections, ktore zawieraja referencje do Questions. W ten sposob mozemy pobrac wszystkie kolekcje danego uzytkownika, a nastepnie poprzez lookup pobrac powiazane pytania i ich autorow oraz tagi.
  try {
    // Etap bazowy zawiera tylko to, czego potrzebuja filtrowanie, sortowanie i liczenie.
    // Lookup pytania musi tu zostac, bo sortujemy po jego polach (question.upvotes itd.)
    // i szukamy po jego tytule oraz tresci. Autor i tagi sluza wylacznie do wyswietlenia,
    // wiec doczytujemy je dopiero nizej.
    const basePipeline: PipelineStage[] = [
      { $match: { author: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
    ];

    // Dzieki pipeline mozemy teraz dodac wyszukiwanie po query, ktore bedzie przeszukiwac tytul i tresc pytania w kolekcjach uzytkownika. W tym przypadku korzystamy z operatora $regex, aby wyszukiwac frazy w tytule i tresci pytania. Dodatkowo dodajemy opcje "i", aby wyszukiwanie bylo nieczułe na wielkość liter.
    if (query) {
      const search = escapeRegExp(query);
      basePipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: search, $options: "i" } },
            { "question.content": { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    // Count liczymy na samym etapie bazowym. Wczesniej szedl tutaj caly pipeline z trzema
    // lookupami, choc do policzenia dokumentow autor i tagi nie sa do niczego potrzebne.
    const [totalCount] = await Collection.aggregate([...basePipeline, { $count: "count" }]);

    // Kolejnosc jest tu cala poprawka wydajnosci: najpierw sortowanie i paginacja, a dopiero
    // potem lookupy autora i tagow. Dzieki temu Mongo dociaga je wylacznie dla pageSize
    // dokumentow biezacej strony, zamiast dla wszystkich pytan zapisanych przez uzytkownika.
    // Na koncu $project zostawia tylko pola, ktorych faktycznie uzywamy.
    const questions = await Collection.aggregate([
      ...basePipeline,
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: pageSize },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
      {
        $project: {
          question: 1,
          author: 1,
        },
      },
    ]);

    const isNext = totalCount?.count > skip + questions.length;

    return { success: true, data: { collections: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
