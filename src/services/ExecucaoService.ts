import { appDataSource } from "../database/appDataSource.js";
import { ExecucaoManutencao } from "../entities/ExecucaoManutencao.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { AppError } from "../errors/AppError.js";
import { CreateExecucaoSchemaDTO } from "../dtos/CreateExecucaoSchemaDTO.js";

export class ExecucaoService {
    private execRepository = appDataSource.getRepository(ExecucaoManutencao);
    private planoRepository = appDataSource.getRepository(PlanoManutencao);

    async create(data: CreateExecucaoSchemaDTO): Promise<ExecucaoManutencao> {
        const { plano_id, tecnico_id, data_realizada, status, conformidade, observacoes } = data;

        // 1. Valida se o plano existe.
        const plano = await this.planoRepository.findOneBy({ id: plano_id as any });
        if (!plano) {
            throw new AppError("Plano de manutenção não encontrado", 404);
        }

        // 2. Cria o registro da execução com todos os campos do formulário.
        const execucao = this.execRepository.create({
            plano_id,
            tecnico_id: tecnico_id as any,
            data_execucao: new Date(data_realizada),
            status,
            conformidade,
            observacoes,
        });

        // 3. Recalcula proxima_em: data_execucao + periodicidade_days.
        // Usa a data de execução como base, nunca a data atual.
        const proximaData = new Date(data_realizada);
        proximaData.setDate(proximaData.getDate() + plano.periodicidade_days);
        plano.proxima_em = proximaData;

        await this.planoRepository.save(plano);
        return await this.execRepository.save(execucao) as any;
    }

    async listByPlano(plano_id: string): Promise<ExecucaoManutencao[]> {
        return await this.execRepository.find({
            where: { plano_id: plano_id as any },
            order: { data_execucao: "DESC" },
        });
    }

    async listAll(): Promise<ExecucaoManutencao[]> {
        return await this.execRepository.find({
            relations: ["tecnico", "plano"],
            order: { data_execucao: "DESC" },
        });
    }
}
