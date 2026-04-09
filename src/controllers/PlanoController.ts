import { Request, Response } from "express";
import { PlanoService } from "../services/PlanoService.js";
import { UpdatePlanoSchemaDTO } from "../dtos/UpdatePlanoSchemaDTO.js";

export default class PlanoController {
    constructor(private service: PlanoService) {}

    // Criar um novo plano
    async create(req: Request, res: Response) {
        const plano = await this.service.create(req.body);
        return res.status(201).json(plano);
    }

    // Listar planos de um equipamento específico
    async findByEquipamento(req: Request, res: Response) {
        const { id } = req.params;
        const planos = await this.service.listByEquipamento(id as string);
        return res.status(200).json(planos);
    }

    // Buscar detalhes de um único plano
    async findOne(req: Request, res: Response) {
        const { id } = req.params;
        const plano = await this.service.findById(id as string);
        return res.status(200).json(plano);
    }

    // Atualizar dados de um plano
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const data: UpdatePlanoSchemaDTO = req.body;
        const plano = await this.service.update(id as string, data);
        return res.status(200).json(plano);
    }

    // Deletar (Desativar) um plano
    async delete(req: Request, res: Response) {
        const { id } = req.params;
        await this.service.delete(id as string);
        return res.status(204).send();
    }
}