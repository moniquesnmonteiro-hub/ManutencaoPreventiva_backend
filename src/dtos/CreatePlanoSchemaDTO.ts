import { z } from 'zod';

export const createPlanoSchema = z.object({
    equipamento_id: z.uuid({ message: "ID do equipamento inválido" }),

    descricao: z.string()
        .trim()
        .min(5, { message: "A descrição deve ter no mínimo 5 caracteres" }),
    
    periodicidade: z.number()
        .positive({ message: "A periodicidade deve ser um número de dias positivo" }),

    data_inicio: z.iso.datetime({ message: "Formato de data inválido. Use o padrão AAAA-MM-DD (Ano-Mês-Dia)" })
});

export type CreatePlanoSchemaDTO = z.infer<typeof createPlanoSchema>;