import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { flattenError } from "zod";

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content, userAnswer });

    if (!validatedData.success) {
      throw new ValidationError(flattenError(validatedData.error).fieldErrors);
    }

    const { text } = await generateText({
      model: google("gemini-3.6-flash"),
      prompt: `
      <question>
      ${question}
      </question>

      <context>
      ${content}
      </context>

      <user_answer>
      ${userAnswer ? userAnswer : ""}
      </user_answer>

      Evaluate the user's answer above against the question and context.

      - If the user's answer is correct and complete, use it as the foundation for your response — refine wording only if needed for clarity.
      - If the user's answer is partially correct, incomplete, or contains errors, correct and complete it while preserving any parts that were accurate.
      - If the user's answer is entirely incorrect, empty or irrelevant, provide the correct answer without referencing the user's attempt.

      Keep the response as concise as the question allows — favor brevity for simple questions, but include necessary detail (e.g. code examples) for technical questions that require it.

      Respond in markdown format only. Do not include any preamble, meta-commentary, or explanation of your evaluation process — output only the final answer.`,
      system: `You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).`,
      maxOutputTokens: 1000, // opcjonalnie, dla kontroli kosztów/długości
      temperature: 0.7,
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
