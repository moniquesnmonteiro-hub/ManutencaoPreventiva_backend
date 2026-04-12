import "reflect-metadata";
import "dotenv/config";
import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import { appDataSource } from "./database/appDataSource.js";
import equipamentoRoutes from "./routes/equipamentoRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import planoRoutes from "./routes/planoRoutes.js";
import execucaoRoutes from "./routes/execucaoRoutes.js";


const app = express();
app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/equipamentos", equipamentoRoutes);
app.use("/api/planos", planoRoutes);
app.use("/api/execucoes", execucaoRoutes);
app.use (errorHandler);

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