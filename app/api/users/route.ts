import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { RequestError, ValidationError } from "@/lib/http-errors";
import { flattenError } from "zod";

// GET /api/users - Pobiera wszystkich użytkowników z bazy danych. W przypadku błędu w trakcie pobierania, zwraca odpowiedni komunikat o błędzie.
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

// POST /api/users - Tworzy nowego użytkownika na podstawie danych przesłanych w żądaniu i zwraca go w formacie JSON. W przypadku błędu w trakcie tworzenia, zwraca odpowiedni komunikat o błędzie.
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
    if (existingEmail) throw new RequestError(409, `User with email ${email} already exists`);

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new RequestError(409, `User with username ${username} already exists`);

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
