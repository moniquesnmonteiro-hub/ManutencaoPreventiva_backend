import type { RequestHandler } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export const validateBody = (schema: ZodType<any>): RequestHandler => {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            return next(new AppError("Dados inválidos", 400, result.error.issues));
        }

        req.body = result.data;
        return next();
    };
};