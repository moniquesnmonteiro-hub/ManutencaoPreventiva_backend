import { Router } from "express";
import { appDataSource } from "../database/appDataSource.js";
import AuthController from "../controllers/AuthController.js";
import { AuthService } from "../services/AuthService.js";
import { validateBody } from "../middleware/validateBody.js";
import { loginSchema, refreshSchema } from "../dtos/AuthDTO.js";

const router = Router();
const service = new AuthService(appDataSource);
const controller = new AuthController(service);

router.post("/login", validateBody(loginSchema), controller.login.bind(controller));
router.post("/refresh", validateBody(refreshSchema), controller.refresh.bind(controller));
router.post("/logout", controller.logout.bind(controller));

export default router;