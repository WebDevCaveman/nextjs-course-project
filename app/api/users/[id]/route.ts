import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import User from "@/database/user.model";
import { NextResponse } from "next/server";
import { UserSchema } from "@/lib/validations";
import { flattenError } from "zod";

// GET /api/users/[id] - Pobiera użytkownika o określonym ID z bazy danych. W przypadku braku użytkownika lub błędu w trakcie pobierania, zwraca odpowiedni komunikat o błędzie.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const user = await User.findById(id);

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

// PUT /api/users/[id] - Aktualizuje użytkownika o określonym ID w bazie danych na podstawie danych przesłanych w żądaniu. W przypadku braku użytkownika lub błędu w trakcie aktualizacji, zwraca odpowiedni komunikat o błędzie.
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const body = await req.json();

    // W tym przypadku używamy metody partial() z biblioteki zod, która pozwala na walidacje tylko tych pól, które zostały przesłane w żądaniu. W ten sposób możemy aktualizować tylko te pola, które zostały przesłane w żądaniu, a pozostałe pola pozostają bez zmian.
    const validatedData = UserSchema.partial().safeParse(body);

    // safeParse nie rzuca wyjątkiem, tylko zwraca obiekt z polem success - dlatego musimy sami sprawdzić, czy walidacja się powiodła. Jeśli nie, rzucamy ValidationError z listą błędów dla poszczególnych pól, dzięki czemu klient dostanie status 400 i informacje, które pola są niepoprawne.
    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    // W tym przypadku używamy metody findByIdAndUpdate z biblioteki mongoose, która pozwala na aktualizacje dokumentu w bazie danych na podstawie jego ID. W tym przypadku przekazujemy do tej metody ID użytkownika, który ma zostać zaktualizowany, oraz dane, które mają zostać zaktualizowane. Dodatkowo przekazujemy opcję { new: true }, która powoduje, że metoda ta zwraca zaktualizowany dokument zamiast dokumentu przed aktualizacją.
    const updatedUser = await User.findByIdAndUpdate(id, validatedData.data, { new: true });

    if (!updatedUser) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/[id] - Usuwa użytkownika o określonym ID z bazy danych. W przypadku braku użytkownika lub błędu w trakcie usuwania, zwraca odpowiedni komunikat o błędzie.
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");

  try {
    await dbConnect();
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) throw new NotFoundError("User");

    return NextResponse.json(
      {
        success: true,
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
