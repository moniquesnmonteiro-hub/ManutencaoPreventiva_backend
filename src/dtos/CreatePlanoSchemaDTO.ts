import { z } from 'zod';

export const createPlanoSchema = z.object({
    equipamento_id: z.string().uuid({ message: "Equipamento inválido" }),

    descricao: z.string()
        .trim()
        .min(5, { message: "A descrição deve ter no mínimo 5 caracteres" }),

    periodicidade: z.coerce.number()
        .int()
        .positive({ message: "A periodicidade deve ser um número de dias positivo" }),

    data_inicio: z.iso.datetime({ message: "Formato de data inválido. Use o padrão AAAA-MM-DDTHH:mm:ss.sssZ" })
});

export type CreatePlanoSchemaDTO = z.infer<typeof createPlanoSchema>;