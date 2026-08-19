import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { ValidationError } from "@/lib/http-errors";
import { flattenError } from "zod";

// W tym przypadku tworzymy sobie funkcje, ktore pozwolą nam pobierać wszystkich uytkowników z bazy danych. W tym przypadku używamy metody GET, która jest odpowiednia do pobierania danych. Funkcja ta łączy się z bazą danych, pobiera wszystkich użytkowników i zwraca ich w formacie JSON. W przypadku wystąpienia błędu, funkcja obsługuje go za pomocą funkcji handleError i zwraca odpowiedni komunikat o błędzie.
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Teraz z kolei mając ju wszystkie zabezpieczenia moemy utworzyć nowego uzytkownika w bazie danych. W tym przypadku używamy metody POST, która jest odpowiednia do tworzenia nowych zasobów. Funkcja ta łączy się z bazą danych, tworzy nowego użytkownika na podstawie danych przesłanych w żądaniu i zwraca go w formacie JSON. W przypadku wystąpienia błędu, funkcja obsługuje go za pomocą funkcji handleError i zwraca odpowiedni komunikat o błędzie.
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error(`User with email ${email} already exists`);

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error(`User with username ${username} already exists`);

    const newUser = await User.create(validatedData.data);
    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
