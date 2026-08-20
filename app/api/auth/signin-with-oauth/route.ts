import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import mongoose from "mongoose";
import { flattenError } from "zod";
import slugify from "slugify";
import User from "@/database/user.model";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  // Tworzymy nową sesję Mongoose, aby zapewnić atomowe operacje na bazie danych - a to oznacza, że wszystkie operacje w ramach tej sesji będą traktowane jako jedna transakcja. Jeśli którakolwiek z operacji zakończy się niepowodzeniem, wszystkie zmiany zostaną wycofane, co zapewnia spójność danych.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Sprawdzamy, czy użytkownik już istnieje w bazie danych na podstawie providerAccountId
    const validatedData = SignInWithOAuthSchema.safeParse({ provider, providerAccountId, user });

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    // Pomimo tego, ze dostajemy juz username z frontendu to moze on zawierac niedozowolone znaki, spacje, itd. Dlatego tez korzystamy z biblioteki slugify, aby wygenerowac poprawny username
    const { name, username, email, image } = user;
    const slugifiedUsername = slugify(username, { lower: true, strict: true, trim: true });

    // Dzieki let mozemy nadpisac zmienna existingUser w przypadku gdy uzytkownik nie istnieje i zostanie utworzony nowy uzytkownik. Jesli uzytkownik istnieje to nadpisujemy jego dane tylko jesli sa one inne niz te w bazie danych.
    let existingUser = await User.findOne({ email }).session(session);
    if (!existingUser) {
      [existingUser] = await User.create([{ name, username: slugifiedUsername, email, image }], { session });
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne({ _id: existingUser._id }, { $set: updatedData }).session(session);
      }
    }

    // Teraz kolejnym krokiem jest wyszukanie account dla danego uzytkownika. Jesli nie istnieje to tworzymy nowe konto, jesli istnieje to aktualizujemy jego dane.
    const existingAccount = await Account.findOne({ userId: existingUser._id, provider, providerAccountId }).session(
      session
    );

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name: existingUser.name,
            image: existingUser.image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
