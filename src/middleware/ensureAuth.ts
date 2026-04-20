import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export const ensureAuth: RequestHandler = (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        throw new AppError("Token ausente", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
        req.auth = { sub: decoded.sub, perfil: decoded.perfil };
        return next();
    } catch {
        throw new AppError("Token inválido ou expirado", 401);
    }
};