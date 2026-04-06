import { z } from 'zod';

export const createEquipamentoSchema = z.object({
    codigo: z.string()
        .trim()
        .min(1, "O código é obrigatório")
        .max(50, "O código deve ter no máximo 50 caracteres"),
    
    nome: z.string()
        .trim()
        .min(1, "O nome é obrigatório")
        .max(100),
    
    tipo: z.string()
        .trim()
        .min(1, "O tipo é obrigatório"),
    
    localizacao: z.string()
        .trim()
        .min(1, "A localização é obrigatória"),
    
    fabricante: z.string()
        .trim()
        .optional()
        .nullable(),
    
    modelo: z.string()
        .trim()
        .optional()
        .nullable(),
    
    ativo: z.boolean().default(true).optional()
});

export const updateEquipamentoSchema = createEquipamentoSchema.partial();

export type CreateEquipamentoSchemaDTO = z.infer<typeof createEquipamentoSchema>;
export type UpdateEquipamentoSchemaDTO = z.infer<typeof updateEquipamentoSchema>;