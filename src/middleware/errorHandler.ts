import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            data: err.data
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            status: "error",
            message: "Dados inválidos",
            data: err.issues 
        });
    }

    console.error(err);

    return res.status(500).json({
        status: "error",
        message: "Erro interno do servidor"
    });
};