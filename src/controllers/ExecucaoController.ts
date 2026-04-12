import { Request, Response } from "express";
import { ExecucaoService } from "../services/ExecucaoService.js";

export default class ExecucaoController {
    constructor(private service: ExecucaoService) {}

    async create(req: Request, res: Response) {
        const execucao = await this.service.create(req.body);
        return res.status(201).json(execucao);
    }

    async findByPlano(req: Request, res: Response) {
        const { id } = req.params;
        const historico = await this.service.listByPlano(id as string);
        return res.status(200).json(historico);
    }

    async findAll(req: Request, res: Response) {
        const execucoes = await this.service.listAll();
        return res.status(200).json(execucoes);
    }
}