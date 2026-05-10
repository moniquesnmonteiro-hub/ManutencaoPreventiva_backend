import { Request, Response } from "express";
import { appDataSource } from "../database/appDataSource.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { ExecucaoManutencao } from "../entities/ExecucaoManutencao.js";
import { LessThan, Between } from "typeorm";

export class DashboardController {
    async getSummary(req: Request, res: Response) {
        try {
            const planoRepo = appDataSource.getRepository(PlanoManutencao);
            const execRepo = appDataSource.getRepository(ExecucaoManutencao);

            // Data de hoje sem horário para comparar com coluna date.
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            // Intervalo do mês atual.
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);

            // Data limite de 7 dias a partir de hoje.
            const seteDias = new Date(hoje);
            seteDias.setDate(hoje.getDate() + 7);

            // Conta planos ativos com proxima_em anterior a hoje.
            const atrasadas = await planoRepo.count({
                where: { proxima_em: LessThan(hoje), ativo: true }
            });

            // Conta planos ativos previstos para os próximos 7 dias.
            const proximasSeteDias = await planoRepo.count({
                where: { proxima_em: Between(hoje, seteDias), ativo: true }
            });

            // Conta todas as execuções registradas no mês atual.
            const totalExecucoesMes = await execRepo.count({
                where: { data_execucao: Between(inicioMes, fimMes) }
            });

            // Conta execuções conformes no mês
            const conformesMes = await execRepo.count({
                where: { data_execucao: Between(inicioMes, fimMes), conformidade: true }
            });

            // Percentual de conformidade do mês (0 se não houver execuções).
            const conformidadeMes = totalExecucoesMes > 0
                ? Math.round((conformesMes / totalExecucoesMes) * 100)
                : 0;

            // Todos os planos atrasados ordenados pelo mais antigo, com equipamento.
            const planosAtrasados = await planoRepo.find({
                where: { proxima_em: LessThan(hoje), ativo: true },
                relations: ["equipamento"],
                order: { proxima_em: "ASC" }
            });

            // Calcula dias de atraso para cada plano.
            const alertas = planosAtrasados.map(plano => {
                const proxima = new Date(plano.proxima_em);
                proxima.setHours(0, 0, 0, 0);
                const diasAtraso = Math.floor(
                    (hoje.getTime() - proxima.getTime()) / 86_400_000
                );
                return {
                    id: plano.id,
                    titulo: plano.titulo,
                    proxima_em: plano.proxima_em,
                    diasAtraso,
                    equipamento: plano.equipamento
                        ? { nome: plano.equipamento.nome, codigo: plano.equipamento.codigo }
                        : null
                };
            });

            return res.json({
                indicadores: {
                    atrasadas,
                    proximasSeteDias,
                    realizadasNoMes: totalExecucoesMes,
                    conformidadeMes
                },
                alertas
            });

        } catch (error) {
            return res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
        }
    }
}
