import { Request, Response } from "express";
import { appDataSource } from "../database/appDataSource.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { ExecucaoManutencao } from "../entities/ExecucaoManutencao.js";
import { LessThan, Between } from "typeorm";

export class DashboardController {
    async getSummary(req: Request, res: Response) {
        try {
            const planoRepository = appDataSource.getRepository(PlanoManutencao);
            const execRepository = appDataSource.getRepository(ExecucaoManutencao);

            const hoje = new Date();
            
            // Início e fim do mês atual para os indicadores mensais
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

            // 1. Manutenções Atrasadas
            const atrasados = await planoRepository.count({
                where: {
                    proxima_em: LessThan(hoje)
                }
            });

            // 2. Total de Execuções no Mês Atual
            const execucoesMes = await execRepository.count({
                where: {
                    data_execucao: Between(inicioMes, fimMes)
                }
            });

            // 3. Manutenções Previstas para os próximos 7 dias
            const seteDiasDepois = new Date();
            seteDiasDepois.setDate(hoje.getDate() + 7);
            
            const proximas = await planoRepository.count({
                where: {
                    proxima_em: Between(hoje, seteDiasDepois)
                }
            });

            // 4. Lista das 5 manutenções mais atrasadas (Para o widget de alerta)
            const listaAtrasados = await planoRepository.find({
                where: { proxima_em: LessThan(hoje) },
                relations: ["equipamento"],
                order: { proxima_em: "ASC" },
                take: 5
            });

            return res.json({
                indicadores: {
                    atrasadas: atrasados,
                    realizadasNoMes: execucoesMes,
                    proximasSeteDias: proximas,
                    conformidadeMes: 100 // Valor fixo para V1
                },
                alertas: listaAtrasados
            });

        } catch (error) {
            return res.status(500).json({ error: "Erro ao carregar dados do dashboard" });
        }
    }
}