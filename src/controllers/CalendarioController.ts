import { Request, Response } from "express";
import { CalendarioService, FiltroCalendario } from "../services/CalendarioService.js";

export class CalendarioController {
    private service = new CalendarioService();

    async listar(req: Request, res: Response): Promise<void> {
        // Lê o filtro de status da query string (padrão: 'todas').
        const filtro = (req.query.filtro as FiltroCalendario) ?? 'todas';
        // Lê o filtro por equipamento (opcional).
        const equipamento_id = req.query.equipamento_id as string | undefined;

        const planos = await this.service.listar(filtro, equipamento_id);
        res.status(200).json(planos);
    }
}
