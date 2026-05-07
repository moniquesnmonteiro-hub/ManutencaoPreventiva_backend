import { appDataSource } from "../database/appDataSource.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { ExecucaoManutencao } from "../entities/ExecucaoManutencao.js";
import { Between, LessThan } from "typeorm";

// Tipos de filtro disponíveis para o calendário.
export type FiltroCalendario = 'atrasadas' | 'esta_semana' | 'este_mes' | 'todas';

export class CalendarioService {
    private planoRepository = appDataSource.getRepository(PlanoManutencao);
    private execRepository = appDataSource.getRepository(ExecucaoManutencao);

    async listar(filtro: FiltroCalendario = 'todas', equipamento_id?: string): Promise<any[]> {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Monta a condição de data conforme o filtro escolhido.
        let condicaoData: any = {};

        if (filtro === 'atrasadas') {
            condicaoData = { proxima_em: LessThan(hoje) };
        } else if (filtro === 'esta_semana') {
            const fimSemana = new Date(hoje);
            fimSemana.setDate(fimSemana.getDate() + 7);
            condicaoData = { proxima_em: Between(hoje, fimSemana) };
        } else if (filtro === 'este_mes') {
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            condicaoData = { proxima_em: Between(inicioMes, fimMes) };
        }

        const where: any = { ativo: true, ...condicaoData };
        if (equipamento_id) where.equipamento_id = equipamento_id;

        // Busca os planos com equipamento e técnico padrão.
        const planos = await this.planoRepository.find({
            where,
            relations: ['equipamento', 'tecnico'],
            order: { proxima_em: 'ASC' },
        });

        if (planos.length === 0) return [];

        // Busca a última execução de cada plano para obter o executor real.
        const planoIds = planos.map(p => p.id);
        const execucoes = await this.execRepository
            .createQueryBuilder('exec')
            .leftJoinAndSelect('exec.tecnico', 'tecnico')
            .where('exec.plano_id IN (:...planoIds)', { planoIds })
            .orderBy('exec.data_execucao', 'DESC')
            .getMany();

        // Monta um mapa plano_id -> última execução (a primeira do array já é a mais recente).
        const ultimaExecMap = new Map<string, ExecucaoManutencao>();
        for (const exec of execucoes) {
            if (!ultimaExecMap.has(exec.plano_id as string)) {
                ultimaExecMap.set(exec.plano_id as string, exec);
            }
        }

        // Retorna os planos com o último executor anexado.
        return planos.map(plano => {
            const ultimaExec = ultimaExecMap.get(plano.id);
            return {
                ...plano,
                // Se houve execução, mostra quem executou. Senão, null.
                ultimo_executor: ultimaExec?.tecnico
                    ? { id: ultimaExec.tecnico.id, nome: ultimaExec.tecnico.nome }
                    : null,
            };
        });
    }
}
