import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";
import { AccountSchema } from "@/lib/validations";
import { flattenError } from "zod";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();
    const account = await Account.findById(id);

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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    const body = await req.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    await dbConnect();
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData.data, { new: true });

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: updatedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();
    const deletedAccount = await Account.findByIdAndDelete(id);

    if (!deletedAccount) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: deletedAccount,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
