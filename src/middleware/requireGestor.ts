import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { Perfil } from "../types/Perfil.js";

// Middleware que restringe o acesso a usuários com perfil Gestor.
export const requireGestor: RequestHandler = (req, _res, next) => {
    // Aceita tanto o valor numérico quanto o nome string do enum.
    const perfil = req.auth?.perfil;
    if (perfil !== Perfil.GESTOR && perfil !== "GESTOR") {
        throw new AppError("Acesso restrito a gestores", 403);
    }
    return next();
};
