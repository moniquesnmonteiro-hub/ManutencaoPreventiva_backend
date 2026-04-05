import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { AppError } from "./errors/AppError.js";
import { appDataSource } from "./database/appDataSource.js";


const app = express();
app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      data: err.data,
    });
  }
  console.error(err);
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

appDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");

    const PORT = process.env.PORT
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log("Local: Manaus, AM - Polo Industrial");
    });
  })
  .catch((err: Error) => {
    console.error("Erro durante a inicialização do banco de dados", err);
  });