import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { AccountSchema } from "@/lib/validations";
import { RequestError, ValidationError } from "@/lib/http-errors";
import { flattenError } from "zod";
import Account from "@/database/account.model";

// GET /api/accounts - Pobiera wszystkie konta z bazy danych. W przypadku błędu w trakcie pobierania, zwraca odpowiedni komunikat o błędzie.
export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();

    return NextResponse.json(
      {
        success: true,
        data: accounts,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/accounts - Tworzy nowe konto na podstawie danych przesłanych w żądaniu i zwraca je w formacie JSON. W przypadku błędu w trakcie tworzenia, zwraca odpowiedni komunikat o błędzie.
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const validatedData = AccountSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const existingAccount = await Account.findOne({
      provider: validatedData.data.provider,
      providerAccountId: validatedData.data.providerAccountId,
    });
    if (existingAccount) throw new RequestError(409, "Account with the same provider already exists");

    const newAccount = await Account.create(validatedData.data);
    return NextResponse.json(
      {
        success: true,
        data: newAccount,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
