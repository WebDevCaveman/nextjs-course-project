import { NextResponse } from "next/server";
import { RequestError, ValidationError } from "../http-errors";
import { ZodError, flattenError } from "zod";
import logger from "../logger";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status: statusCode })
    : { status: statusCode, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error({ err: error }, `${responseType.toUpperCase()} ERROR: ${error.message}`);
    return formatResponse(responseType, error.statusCode, error.message, error.errors);
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(flattenError(error).fieldErrors as Record<string, string[]>);

    logger.error({ err: error }, `VALIDATION ERROR: ${validationError.message}`);

    return formatResponse(responseType, validationError.statusCode, validationError.message, validationError.errors);
  }

  if (error instanceof Error) {
    logger.error(error.message);

    return formatResponse(responseType, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred:");
  return formatResponse(responseType, 500, "An unexpected error occurred.");
};

export default handleError;
