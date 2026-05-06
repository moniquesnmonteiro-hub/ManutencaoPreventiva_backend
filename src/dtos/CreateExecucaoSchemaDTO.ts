import { z } from 'zod';

// Schema de validação para criação de execução de manutenção.
export const createExecucaoSchema = z.object({
    // ID do plano de manutenção executado.
    plano_id: z.string().uuid({ message: "ID do plano inválido" }),

    // ID do técnico que executou (inteiro, PK do usuario).
    tecnico_id: z.coerce.number().int().positive({ message: "ID do técnico inválido" }),

    // Data em que a manutenção foi realizada.
    data_realizada: z.iso.datetime({ message: "Formato de data inválido. Use AAAA-MM-DDTHH:mm:ss.sssZ" }),

    // Status da execução.
    status: z.enum(["realizada", "parcial", "nao_realizada"], {
        message: "Status deve ser 'realizada', 'parcial' ou 'nao_realizada'"
    }).default("realizada"),

    // Se a manutenção foi executada conforme o plano.
    conformidade: z.boolean({ message: "Conformidade deve ser verdadeiro ou falso" }).default(true),

    // Observações do técnico (opcional).
    observacoes: z.string().trim().optional(),
});

export type CreateExecucaoSchemaDTO = z.infer<typeof createExecucaoSchema>;
