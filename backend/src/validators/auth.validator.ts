import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const googleLoginSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyResetTokenSchema = z.object({
  token: z.string().length(6, "Token must be 6 characters long"),
});

export const resetPasswordSchema = z.object({
  token: z.string().length(6, "Token must be 6 characters long"),
  password: passwordSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;


export type GoogleLoginSchemaType = z.infer<typeof googleLoginSchema>;

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetTokenSchemaType = z.infer<typeof verifyResetTokenSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;