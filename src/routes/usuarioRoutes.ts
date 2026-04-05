import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { UsuarioService } from "../services/UsuarioService.js";
import { validateBody } from "../middleware/validateBody.js";
import { createUserSchema, updateUserSchema } from "../dtos/CreateUserSchemaDTO.js";

const router = Router();
const usuarioService = new UsuarioService(); 
const usuarioController = new UsuarioController(usuarioService);

router.get("/", usuarioController.findAllUsers.bind(usuarioController));

router.get("/:id", usuarioController.findUserById.bind(usuarioController));

router.post("/", validateBody(createUserSchema), usuarioController.createUser.bind(usuarioController));

router.put("/:id", validateBody(updateUserSchema), usuarioController.updateUser.bind(usuarioController));

router.delete("/:id", usuarioController.deleteUser.bind(usuarioController));

export default router;