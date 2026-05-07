import { Router } from "express";
import authRoutes from "./authRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import equipamentoRoutes from "./equipamentoRoutes.js";
import planoRoutes from "./planoRoutes.js";
import execucaoRoutes from "./execucaoRoutes.js";
import { ensureAuth } from "../middleware/ensureAuth.js";
import { DashboardController } from "../controllers/DashboardController.js";
import { CalendarioController } from "../controllers/CalendarioController.js";

const routes = Router();
const dashboardController = new DashboardController();
const calendarioController = new CalendarioController();

routes.use("/auth", authRoutes);

routes.use(ensureAuth);

routes.use("/usuarios", usuarioRoutes);
routes.use("/equipamentos", equipamentoRoutes);
routes.use("/planos", planoRoutes);
routes.use("/execucoes", execucaoRoutes);
routes.get("/dashboard/summary", dashboardController.getSummary);
routes.get("/calendario", (req, res) => calendarioController.listar(req, res));

export default routes;