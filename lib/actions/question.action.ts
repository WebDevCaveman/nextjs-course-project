// Utworzenie pytania wymaga nastepujacych operacji:
// - walidacja danych wejściowych (tytuł, treść, tagi)
// - autoryzacja użytkownika (sprawdzenie, czy jest zalogowany)
// - zapisanie pytania w bazie danych
// - sprawdzenie czy dany tag istnieje w bazie danych, jeśli nie, to utworzenie go lub dodanie ilosci pytan do istniejacego
// - powiazanie tagu z pytaniem poprzez TagQuestion
// - dodanie do pytania informacji o autorze (userId) oraz listy odniesien do tagow
// A wiec w takim przypadku musimy skorzystac z transactions w mongoose, aby zapewnic atomowosc operacji. W przypadku bledow w trakcie zapisu pytania lub tagu, transakcja zostanie wycofana i dane nie zostana zapisane w bazie danych. Czyli nie bedziemy miec zadnych osieroconych tagow lub pytan w bazie danych. W przypadku powodzenia transakcji, pytanie zostanie zapisane w bazie danych wraz z powiazanymi tagami i informacja o autorze.

"use server";

import { CreateQuestionParams } from "@/types/action";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";
import action from "../handlers/action";
import mongoose from "mongoose";
import Question, { IQuestionDoc } from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export const createQuestion = async (params: CreateQuestionParams): Promise<ActionResponse<IQuestionDoc>> => {
  const validationResult = await action({ params, schema: AskQuestionSchema, authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { title, content, tags } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();
  let question: IQuestionDoc | null = null;

  try {
    question = (
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
      const upsertedTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag.toLowerCase()}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(upsertedTag._id);
      tagQuestionDocuments.push({ question: question._id, tag: upsertedTag._id });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(question._id, { $set: { tags: tagIds } }, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }

  return { success: true, data: JSON.parse(JSON.stringify(question)) };
};
