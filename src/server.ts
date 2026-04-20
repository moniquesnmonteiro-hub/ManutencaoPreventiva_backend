import "reflect-metadata";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { appDataSource } from "./database/appDataSource.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

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