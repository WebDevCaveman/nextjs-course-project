import * as z from "zod";

export const SignInSchema = z.object({
  email: z.email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must be at most 24 characters" }),
});

export const ForgotPasswordSchema = SignInSchema.pick({ email: true });

export const SignUpSchema = SignInSchema.extend({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(30, { message: "Username must be at most 30 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[\p{L} ]+$/u, { message: "Name can only contain letters and spaces" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must be at most 24 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" }),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  content: z.string().min(1, { message: "Body is required" }),
  tags: z
    .array(z.string().min(1, { message: "Tag is required" }).max(15, { message: "Title cannot exceed 15 characters" }))
    .min(1, { message: "At least one tag is required" })
    .max(3, { message: "Cannot add more than 3 tags" })
    // Normalizujemy nazwy tagów do małych liter i odsiewamy duplikaty ("react" i "React" to ten
    // sam tag). To jedyne miejsce, w którym wymuszamy tę regułę — createQuestion i editQuestion
    // dostają już znormalizowaną tablicę, więc ich $setOnInsert zapisuje do bazy małe litery bez
    // dodatkowego toLowerCase(). Formularz pilnuje duplikatów po stronie klienta, ale server
    // action to granica zaufania: bez tego ręcznie wysłane ["react", "React"] podbiłoby licznik
    // Tag.questions o 2 i utworzyłoby dwa wpisy TagQuestion dla jednego tagu.
    .transform((tags) => [...new Set(tags.map((tag) => tag.toLowerCase()))]),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.email({ message: "Please provide a valid email address" }),
  bio: z.string().optional(),
  image: z.url({ message: "Please provide a valid URL for the image" }).optional(),
  location: z.string().optional(),
  portfolio: z.url({ message: "Please provide a valid URL for the portfolio" }).optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  image: z.url({ message: "Please provide a valid URL for the image" }).optional(),
  password: SignUpSchema.shape.password.optional(),
  provider: z.enum(["credentials", "google", "github"], { message: "Provider must be credentials, google or github" }),
  providerAccountId: z.string().min(1, { message: "Provider account ID is required" }),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string().min(1, { message: "Provider account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    email: z.email({ message: "Please provide a valid email address" }),
    image: z.url({ message: "Please provide a valid URL for the image" }).optional(),
  }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamsSchema.extend({
  tagId: z.string().min(1, { message: "Tag ID is required" }),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const AnswerSchema = z.object({
  content: z.string().min(100, { message: "Answer must be at least 100 characters long" }),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetAnswersSchema = PaginatedSearchParamsSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Question is required" })
    .max(130, { message: "Question cannot exceed 130 characters" }),
  content: z.string().min(100, { message: "Answer must be at least 100 characters long" }),
  userAnswer: z.string().trim().min(50, { message: "User answer must be at least 50 characters long" }),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required" }),
  targetType: z.enum(["question", "answer"], { message: "Target type must be either 'question' or 'answer'" }),
  voteType: z.enum(["upvote", "downvote"], { message: "Vote type must be either 'upvote' or 'downvote'" }),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const GetAnswerVotesSchema = z.object({
  answerIds: z.array(z.string().min(1, { message: "Answer ID is required" })),
});
