"use server";

import type { SignInWithCredentialsParams } from "@/types/action";
import action from "../handlers/action";
import { SignUpSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import User, { IUserDoc } from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";

export const signUpWithCredentials = async (params: SignInWithCredentialsParams): Promise<ActionResponse> => {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // W tym miejscu tworzymy nowego uzytkownika, wiec musimy zahashowac jego haslo przed zapisaniem do bazy danych. Uzywamy do tego npm bcryptjs, ktory jest popularna biblioteka do hashowania hasel w Node.js. Funkcja bcrypt.hash() przyjmuje haslo oraz liczbe rund hashowania (salt rounds) i zwraca zahashowane haslo.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Najpierw tworzymy usera - jesli przekazujemy tam tylko jeden obiekt, tak jak tutaj to metoda zwraca pojedynczy obiekt zawierajacy zarowno to co przekazalismy + to co doklada mongoose. Natomiast my jeszcze przekazujemy tutaj opcje {session} dlatego musimy uzyc metody create() z tablica, bo w przeciwnym razie nie bedziemy mogli przekazac opcji {session} - bedzie traktowana jako kolejny element, ktory chcemy utworzyc.
    const [newUser] = (await User.create([{ name, username, email }], { session })) as IUserDoc[];

    // A następnie account
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          password: hashedPassword,
          provider: "credentials",
          providerAccountId: email,
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
};
