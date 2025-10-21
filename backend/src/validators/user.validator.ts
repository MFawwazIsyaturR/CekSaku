import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Kata sandi lama diperlukan"),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Konfirmasi kata sandi minimal 6 karakter"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Kata sandi baru dan konfirmasi tidak cocok",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof changePasswordSchema>;