import { Router } from "express";
import { PlanoService } from "../services/PlanoService.js";
import PlanoController from "../controllers/PlanoController.js";
import { validateBody } from "../middleware/validateBody.js";
import { createPlanoSchema } from "../dtos/CreatePlanoSchemaDTO.js";
import { updatePlanoSchema } from "../dtos/UpdatePlanoSchemaDTO.js";

const router = Router();
const service = new PlanoService();
const controller = new PlanoController(service);

router.post("/", validateBody(createPlanoSchema), controller.create.bind(controller));

router.get("/equipamento/:id", controller.findByEquipamento.bind(controller));

router.get("/:id", controller.findOne.bind(controller));

router.put("/:id", validateBody(updatePlanoSchema), controller.update.bind(controller));

router.delete("/:id", controller.delete.bind(controller));

export default router;