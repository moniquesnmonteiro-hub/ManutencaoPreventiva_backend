import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export default class AuthController {
    constructor(private authService: AuthService) {}

    async login(req: Request, res: Response) {
        const meta = {
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        };

        const result = await this.authService.login(req.body.email, req.body.password, meta);
        return res.json(result);
    }

    async refresh(req: Request, res: Response) {
        const result = await this.authService.refresh(req.body.refreshToken);
        return res.json(result);
    }

    async logout(req: Request, res: Response) {
        await this.authService.logout(req.body.refreshToken);
        return res.status(204).send();
    }
}