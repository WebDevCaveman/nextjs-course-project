// Utworzenie pytania wymaga nastepujacych operacji:
// - walidacja danych wejściowych (tytuł, treść, tagi)
// - autoryzacja użytkownika (sprawdzenie, czy jest zalogowany)
// - zapisanie pytania w bazie danych
// - sprawdzenie czy dany tag istnieje w bazie danych, jeśli nie, to utworzenie go lub dodanie ilosci pytan do istniejacego
// - powiazanie tagu z pytaniem poprzez TagQuestion
// - dodanie do pytania informacji o autorze (userId) oraz listy odniesien do tagow
// A wiec w takim przypadku musimy skorzystac z transactions w mongoose, aby zapewnic atomowosc operacji. W przypadku bledow w trakcie zapisu pytania lub tagu, transakcja zostanie wycofana i dane nie zostana zapisane w bazie danych. Czyli nie bedziemy miec zadnych osieroconych tagow lub pytan w bazie danych. W przypadku powodzenia transakcji, pytanie zostanie zapisane w bazie danych wraz z powiazanymi tagami i informacja o autorze.

"use server";

import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from "@/types/action";
import handleError from "../handlers/error";
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema, PaginatedSearchParamsSchema } from "../validations";
import action from "../handlers/action";
import mongoose, { QueryFilter } from "mongoose";
import Question, { IQuestion } from "@/database/question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import { IUserDoc } from "@/database/user.model";
import TagQuestion from "@/database/tag-question.model";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import { escapeRegExp } from "../utils";

export const createQuestion = async (params: CreateQuestionParams): Promise<ActionResponse<Question>> => {
  const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = (
      await Question.create(
        [
          {
            author: userId,
            title,
            content,
          },
        ],
        { session }
      )
    )[0];

    if (!question) throw new Error("Failed to create question");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      // upsert obsluguje oba przypadki naraz: istniejacy tag dostaje +1 do licznika,
      // a nieistniejacy zostaje utworzony. Z opcjami { upsert, new } zwracany dokument
      // nigdy nie jest nullem, wiec nie ma tu dwoch osobnych sciezek do rozdzielenia.
      // $inc - operator w MongoDB, który pozwala na zwiększenie wartości pola o określoną liczbę. W tym przypadku używamy go do zwiększenia licznika pytań dla danego tagu o 1.
      const upsertedTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${escapeRegExp(tag.toLowerCase())}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(upsertedTag._id);
      tagQuestionDocuments.push({ question: question._id, tag: upsertedTag._id });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(question._id, { $set: { tags: tagIds } }, { session });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

export const editQuestion = async (params: EditQuestionParams): Promise<ActionResponse<Question>> => {
  const validationResult = await action({ params, schema: EditQuestionSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Poniewaz tylko wyszukujemy element to nie musimy dodawac session do findById, bo nie jest to operacja modyfikujaca baze danych. Ale w przypadku update musimy dodac session, bo chcemy aby wszystkie operacje byly w ramach jednej transakcji.
    // Bez populate: tags: [ObjectId("..."), ObjectId("...")]. Z populate: tags: [{ _id, name: "react", questions: 12 }, ...] — czyli mamy od razu question.tags[0].name.
    const question = await Question.findById(questionId).populate<{ tags: ITagDoc[] }>("tags");

    if (!question) throw new NotFoundError("Question");

    if (question.author.toString() !== userId)
      throw new UnauthorizedError("You are not authorized to edit this question");

    question.title = title;
    question.content = content;

    const tagsToAdd = tags.filter((tag) => !question.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()));
    const tagsToRemove = question.tags.filter((t) => !tags.some((tag) => tag.toLowerCase() === t.name.toLowerCase()));

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${escapeRegExp(tag.toLowerCase())}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        newTagDocuments.push({ question: questionId, tag: existingTag._id });
        question.tags.push(existingTag);
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((t) => t._id);

      // Najpierw aktualizujemy Tags i zmniejszamy licznik pytań, a dopiero potem usuwamy powiązania w TagQuestion. W przeciwnym razie moglibyśmy mieć sytuację, w której TagQuestion zostałby usunięty, ale licznik pytań w Tag pozostałby niezmieniony.
      // $in - operator w MongoDB, który pozwala na dopasowanie dokumentów, których wartość pola znajduje się w określonej tablicy wartości. W tym przypadku używamy go do znalezienia wszystkich tagów, które mają zostać usunięte z pytania.
      await Tag.updateMany({ _id: { $in: tagIdsToRemove } }, { $inc: { questions: -1 } }, { session });
      await TagQuestion.deleteMany({ question: questionId, tag: { $in: tagIdsToRemove } }, { session });

      question.tags = question.tags.filter((t) => !tagIdsToRemove.some((id) => id.equals(t._id)));
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
};

// Tu musimy zwrocic uwage na jeden fakt - czyli jak wywolywane są Server Actions w zaleznosci od kontekstu:
// - jeśli robimy to z poziomu server component to zachowuja się one jak zwykle funkcje asynchroniczne, wiec wykorzystanie tutaj takiej funkcji do pobrania pytania z bazy danych jest jak najbardziej poprawne - w takim przypadku zarowno komponent, jak i akcja wywolywane sa po stronie serwera wiec Next nie musi kombinowac jak taka akcje wywolac i korzystac z HTTP requestow.
// - natomiast jeśli robimy to z poziomu client component w form actions lub jako event handler to wtedy taka funkcja jest wywolywana jako POST request do serwera bo Next musi to jakosc ugryzc i stad wykorzystanie HTTP - a wiec jesli musielibysmy pobrac dane w client komponent to mozemy wykorzystac po prostu data fetch co jest szybsze i wydajniejsze niz wywolywanie Server Action, bo nie musimy robic dodatkowego requestu do serwera
export const getQuestion = async (params: GetQuestionParams): Promise<ActionResponse<Question>> => {
  const validationResult = await action({ params, schema: GetQuestionSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate<{ tags: ITagDoc[] }>("tags")
      .populate<{ author: IUserDoc }>("author", "name image");

    if (!question) throw new NotFoundError("Question");

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const getQuestions = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> => {
  const validationResult = await action({ params, schema: PaginatedSearchParamsSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = validationResult.params!;
  const filterQuery: QueryFilter<IQuestion> = {};
  const skip = (page - 1) * pageSize;

  if (filter === "recommended") {
    return { success: true, data: { questions: [], isNext: false } }; // Placeholder for recommended questions logic
  }

  if (query) {
    const search = escapeRegExp(query);
    filterQuery.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "frequent":
      sortCriteria = { answers: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + questions.length;

    return { success: true, data: { questions: JSON.parse(JSON.stringify(questions)), isNext } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
