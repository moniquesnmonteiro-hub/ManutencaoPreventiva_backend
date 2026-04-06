import type { Request, Response } from "express";
import { EquipamentoService } from "../services/EquipamentoService.js";

export default class EquipamentoController {
  private service: EquipamentoService;

  constructor(service: EquipamentoService) {
    this.service = service;
  }

  async create(req: Request, res: Response) {
    const equipamento = await this.service.create(req.body);
    return res.status(201).json(equipamento);
  }

  async findAll(_req: Request, res: Response) {
    const equipamentos = await this.service.listAll();
    return res.status(200).json(equipamentos);
  }

  async findOne(req: Request, res: Response) {
    const { id } = req.params;
    const equipamento = await this.service.listOne(id as string);
    return res.status(200).json(equipamento);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const equipamento = await this.service.update(id as string, req.body);
    return res.status(200).json(equipamento);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    await this.service.delete(id as string);
    return res.status(204).send();
  }
}