import { appDataSource } from "../database/appDataSource.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { Between, LessThan } from "typeorm";

// Tipos de filtro disponíveis para o calendário.
export type FiltroCalendario = 'atrasadas' | 'esta_semana' | 'este_mes' | 'todas';

export class CalendarioService {
    private planoRepository = appDataSource.getRepository(PlanoManutencao);

    async listar(filtro: FiltroCalendario = 'todas', equipamento_id?: string): Promise<PlanoManutencao[]> {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        // Monta a condição de data conforme o filtro escolhido.
        let condicaoData: any = {};

        if (filtro === 'atrasadas') {
            // Planos cuja próxima data já passou.
            condicaoData = { proxima_em: LessThan(hoje) };
        } else if (filtro === 'esta_semana') {
            // Planos previstos nos próximos 7 dias a partir de hoje.
            const fimSemana = new Date(hoje);
            fimSemana.setDate(fimSemana.getDate() + 7);
            condicaoData = { proxima_em: Between(hoje, fimSemana) };
        } else if (filtro === 'este_mes') {
            // Planos previstos dentro do mês atual.
            const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
            condicaoData = { proxima_em: Between(inicioMes, fimMes) };
        }
        // 'todas' não aplica filtro de data.

        // Monta o where combinando data e equipamento (se informado).
        const where: any = {
            ativo: true,
            ...condicaoData,
        };

        // Adiciona filtro por equipamento se fornecido.
        if (equipamento_id) {
            where.equipamento_id = equipamento_id;
        }

        return await this.planoRepository.find({
            where,
            relations: ['equipamento', 'tecnico'],
            order: { proxima_em: 'ASC' },
        });
    }
}
