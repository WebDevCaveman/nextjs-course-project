import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import { AccountSchema } from "@/lib/validations";
import { flattenError } from "zod";

// POST /api/accounts/provider
export async function POST(req: Request) {
  const { providerAccountId } = await req.json();

  try {
    const validatedData = AccountSchema.partial().safeParse({ providerAccountId });

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();
    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
