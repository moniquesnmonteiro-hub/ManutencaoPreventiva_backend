import type { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import type { CreateUserSchemaDTO, UpdateUserSchemaDTO, UpdateMeSchemaDTO } from "../dtos/CreateUserSchemaDTO.js";

export default class UsuarioController {
    private userService: UsuarioService;

    constructor(userService: UsuarioService) {
        this.userService = userService;
    }

    async findAllUsers(req: Request, res: Response) {
        // Aceita ?search=nome para busca de técnicos pelo nome.
        const search = req.query.search as string | undefined;
        const users = await this.userService.listAll(search);
        return res.status(200).json(users);
    }

    async findUserById(req: Request, res: Response) {
        const { id } = req.params;

        const user = await this.userService.listOne(Number(id));
        return res.status(200).json(user);
    }

    async createUser(req: Request, res: Response) {

        const user = await this.userService.create(req.body as CreateUserSchemaDTO);
        return res.status(201).json(user);
    }

    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const user = await this.userService.update(
            Number(id),
            req.body as Partial<UpdateUserSchemaDTO>
        );
        return res.status(200).json(user);
    }

    async updateMe(req: Request, res: Response) {
        const userId = Number(req.auth!.sub);
        const { nome, senha_atual, nova_senha }: UpdateMeSchemaDTO = req.body;
        const usuario = await this.userService.updateMe(userId, nome, senha_atual, nova_senha);
        // Retorna sem expor o hash da senha.
        const { senha_hash, ...result } = usuario as any;
        return res.status(200).json(result);
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        await this.userService.delete(Number(id));
        return res.status(204).send();
    }
}