import { z } from 'zod';

export const createExecucaoSchema = z.object({
    plano_id: z.uuid({ message: "ID do plano inválido" }),
    tecnico_id: z.number({ message: "ID do técnico inválido" }),
    observacoes: z.string().trim().min(5, { message: "Descreva o que foi feito na manutenção" }),
    data_realizada: z.iso.datetime({ message: "Formato de data inválido" })
});

export type CreateExecucaoSchemaDTO = z.infer<typeof createExecucaoSchema>;