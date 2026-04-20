import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { Perfil } from "../types/Perfil.js";

export const ensureRole = (...perfisPermitidos: Perfil[]): RequestHandler => {
    return (req, _res, next) => {
        if (!req.auth) throw new AppError("Não autenticado", 401);

        if (!perfisPermitidos.includes(req.auth.perfil)) {
            throw new AppError("Acesso negado: perfil sem permissão", 403);
        }

        return next();
    };
};