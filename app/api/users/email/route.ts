import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { flattenError } from "zod";

// POST /api/users/email - Pobiera użytkownika o określonym adresie e-mail z bazy danych (adres przesyłamy jako JSON). W przypadku braku użytkownika lub błędu w trakcie pobierania, zwraca odpowiedni komunikat o błędzie.
export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const validatedData = UserSchema.partial().safeParse({ email });

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
