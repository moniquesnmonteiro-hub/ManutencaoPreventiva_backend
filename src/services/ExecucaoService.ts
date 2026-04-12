import { appDataSource } from "../database/appDataSource.js";
import { ExecucaoManutencao } from "../entities/ExecucaoManutencao.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { AppError } from "../errors/AppError.js";
import { CreateExecucaoSchemaDTO } from "../dtos/CreateExecucaoSchemaDTO.js";

export class ExecucaoService {
    private execRepository = appDataSource.getRepository(ExecucaoManutencao);
    private planoRepository = appDataSource.getRepository(PlanoManutencao);

    async create(data: CreateExecucaoSchemaDTO): Promise<ExecucaoManutencao> {
        const { plano_id, tecnico_id, observacoes, data_realizada } = data;

        // 1. Validar se o plano existe
        const plano = await this.planoRepository.findOneBy({ id: plano_id as any });
        if (!plano) {
            throw new AppError("Plano de manutenção não encontrado", 404);
        }

        // 2. Criar o registro da execução
        const execucao = this.execRepository.create({
            plano_id,
            tecnico_id: tecnico_id as any,
            observacoes,
            data_execucao: new Date(data_realizada),
            status: "realizada",
            conformidade: true
        });

        // 3. Calcular a próxima manutenção
        const proximaData = new Date(data_realizada);
        proximaData.setDate(proximaData.getDate() + plano.periodicidade_days);
        
        plano.proxima_em = proximaData;

        await this.planoRepository.save(plano);
        return await this.execRepository.save(execucao) as any;
    }

    async listByPlano(plano_id: string): Promise<ExecucaoManutencao[]> {
        return await this.execRepository.find({
            where: { plano_id: plano_id as any },
            order: { data_execucao: "DESC" }
        });
    }

    async listAll(): Promise<ExecucaoManutencao[]> {
        return await this.execRepository.find({
            relations: ["tecnico", "plano"],
            order: { data_execucao: "DESC" } // As mais recentes primeiro
        });
    }
}