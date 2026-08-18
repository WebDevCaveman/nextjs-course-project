import * as z from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(24, { message: "Password must be at most 24 characters" }),
});

export const forgotPasswordSchema = signInSchema.pick({ email: true });

export const signUpSchema = signInSchema.extend({
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

export const askQuestionSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title is required" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  content: z.string().min(1, { message: "Body is required" }),
  tags: z
    .array(z.string().min(1, { message: "Tag is required" }).max(15, { message: "Title cannot exceed 15 characters" }))
    .min(1, { message: "At least one tag is required" })
    .max(3, { message: "Cannot add more than 3 tags" }),
});
