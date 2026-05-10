import { z } from 'zod';

export const createExecucaoSchema = z.object({
    plano_id: z.string().uuid({ message: "ID do plano inválido" }),
    tecnico_id: z.coerce.number().int().positive({ message: "ID do técnico inválido" }),
    data_realizada: z.iso.datetime({ message: "Formato de data inválido. Use AAAA-MM-DDTHH:mm:ss.sssZ" }),
    status: z.enum(["realizada", "parcial", "nao_realizada"], {
        message: "Status deve ser 'realizada', 'parcial' ou 'nao_realizada'"
    }).default("realizada"),
    conformidade: z.boolean({ message: "Conformidade deve ser verdadeiro ou falso" }).default(true),
    observacoes: z.string().trim().min(1, "Observações são obrigatórias"),
});

export type CreateExecucaoSchemaDTO = z.infer<typeof createExecucaoSchema>;
