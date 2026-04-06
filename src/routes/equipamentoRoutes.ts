import { Router } from "express";
import { EquipamentoService } from "../services/EquipamentoService.js";
import EquipamentoController from "../controllers/EquipamentoController.js";
import { validateBody } from "../middleware/validateBody.js";
import { createEquipamentoSchema, updateEquipamentoSchema } from "../dtos/CreateEquipamentoSchema.js";

const router = Router();
const equipamentoService = new EquipamentoService();
const equipamentoController = new EquipamentoController(equipamentoService);

router.get("/", equipamentoController.findAll.bind(equipamentoController));

router.get("/:id", equipamentoController.findOne.bind(equipamentoController));

router.post(
    "/", 
    validateBody(createEquipamentoSchema), 
    equipamentoController.create.bind(equipamentoController)
);

router.put(
    "/:id", 
    validateBody(updateEquipamentoSchema), 
    equipamentoController.update.bind(equipamentoController)
);

router.delete("/:id", equipamentoController.delete.bind(equipamentoController));

export default router;