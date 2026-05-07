import { appDataSource } from "../database/appDataSource.js";
import { PlanoManutencao } from "../entities/PlanoManutencao.js";
import { Equipamento } from "../entities/Equipamento.js";
import { AppError } from "../errors/AppError.js";
import { CreatePlanoSchemaDTO } from "../dtos/CreatePlanoSchemaDTO.js";
import { UpdatePlanoSchemaDTO } from "../dtos/UpdatePlanoSchemaDTO.js";

export class PlanoService {
    private planoRepository = appDataSource.getRepository(PlanoManutencao);
    private equipRepository = appDataSource.getRepository(Equipamento);

    async create(data: CreatePlanoSchemaDTO): Promise<PlanoManutencao> {
        const { equipamento_id, descricao, periodicidade, data_inicio } = data;

        const equipamento = await this.equipRepository.findOneBy({ 
            id: equipamento_id as any 
        });
        
        if (!equipamento) {
            throw new AppError("Equipamento não encontrado para vincular o plano", 404);
        }

        const plano = this.planoRepository.create({
            equipamento_id,
            equipamento,
            titulo: descricao,
            descricao: descricao,
            periodicidade_days: periodicidade,
            proxima_em: new Date(data_inicio),
            ativo: true
        });

        return await this.planoRepository.save(plano);
    }

async listAll(): Promise<PlanoManutencao[]> {
    return await this.planoRepository.find({ relations: ["equipamento"] });
}

    async listByEquipamento(equipamento_id: string): Promise<PlanoManutencao[]> {
        return await this.planoRepository.find({
            where: { equipamento: { id: equipamento_id as any } },
            order: { proxima_em: "ASC" }
        });
    }

    async findById(id: string): Promise<PlanoManutencao> {
        const plano = await this.planoRepository.findOne({
            where: { id: id as any },
            relations: ["equipamento"]
        });

        if (!plano) {
            throw new AppError("Plano de manutenção não encontrado", 404);
        }

        return plano;
    }

    async update(id: string, data: UpdatePlanoSchemaDTO): Promise<PlanoManutencao> {
        const plano = await this.findById(id);

        if (data.descricao) {
            plano.titulo = data.descricao;
            plano.descricao = data.descricao;
        }
        if (data.periodicidade) {
            plano.periodicidade_days = data.periodicidade;
        }
        if (data.data_inicio) {
            plano.proxima_em = new Date(data.data_inicio);
        }

        return await this.planoRepository.save(plano);
    }

    async atribuirTecnico(planoId: string, tecnicoId: number | null): Promise<PlanoManutencao> {
        const plano = await this.findById(planoId);
        // Atualiza apenas o técnico responsável padrão do plano.
        plano.tecnico_id = tecnicoId as any;
        return await this.planoRepository.save(plano);
    }

    async delete(id: string): Promise<void> {
        const plano = await this.findById(id);
        plano.ativo = false;
        await this.planoRepository.save(plano);
    }
}