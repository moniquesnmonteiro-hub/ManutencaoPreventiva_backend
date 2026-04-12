import { Router } from "express";
import { ExecucaoService } from "../services/ExecucaoService.js";
import ExecucaoController from "../controllers/ExecucaoController.js";
import { validateBody } from "../middleware/validateBody.js";
import { createExecucaoSchema } from "../dtos/CreateExecucaoSchemaDTO.js";

const router = Router();
const service = new ExecucaoService();
const controller = new ExecucaoController(service);

router.post("/", validateBody(createExecucaoSchema), controller.create.bind(controller));
router.get("/plano/:id", controller.findByPlano.bind(controller));
router.get("/", controller.findAll.bind(controller));

export default router;