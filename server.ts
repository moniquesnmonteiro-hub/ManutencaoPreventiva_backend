import "reflect-metadata";
import express from "express";
import { appDataSource } from "./database/appDataSource";  
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized");

    const PORT = process.env.PORT;
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Local: Manaus, AM - Polo Industrial");
    });
  })
  .catch((err: Error) => {
    console.error("Error during Data Source initialization", err);
  });