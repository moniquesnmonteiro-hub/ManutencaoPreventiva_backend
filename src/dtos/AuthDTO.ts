import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "E-mail inválido" }),
    password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres" })
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(10)
});

export const logoutSchema = refreshSchema;

export type LoginDTO = z.infer<typeof loginSchema>;
export type RefreshDTO = z.infer<typeof refreshSchema>;