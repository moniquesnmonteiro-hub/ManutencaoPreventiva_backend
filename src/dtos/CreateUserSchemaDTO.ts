import { z } from 'zod';
import { Perfil } from '../types/Perfil.js';

export const createUserSchema = z.object({
    nome: z.string()
        .trim()
        .min(1)
        .max(100),
    
    email: z.email(),
    
    senha: z.string()
        .min(6)
        .refine((s) => /[A-Z]/.test(s), { 
            message: "Deve conter ao menos 1 letra maiúscula" 
        })
        .refine((s) => /[a-z]/.test(s), { 
            message: "Deve conter ao menos 1 letra minúscula" 
        })
        .refine((s) => /[^A-Za-z0-9]/.test(s), { 
            message: "Deve conter ao menos 1 caractere especial" 
        }),
    
    perfil: z.enum(Perfil)
});

export const updateUserSchema = createUserSchema
    .omit({ senha: true })
    .partial();

export const updateMeSchema = z.object({
    nome: z.string().trim().min(1, "Nome obrigatório").max(100),
    senha_atual: z.string().optional(),
    nova_senha: z.string().min(6, "Mínimo 6 caracteres").optional(),
});

export type CreateUserSchemaDTO = z.infer<typeof createUserSchema>;
export type UpdateUserSchemaDTO = z.infer<typeof updateUserSchema>;
export type UpdateMeSchemaDTO = z.infer<typeof updateMeSchema>;