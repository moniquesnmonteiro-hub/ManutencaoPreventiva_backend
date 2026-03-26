import { hash } from "bcrypt";
import { appDataSource } from "../database/appDataSource";
import { Usuario } from "../entities/Usuario";
import { AppError } from "../errors/AppError";

interface IUsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  cargo: string;
  ativo?: boolean;
}

export class UsuarioService {
  private repository = appDataSource.getRepository(Usuario);

  async create({ nome, email, senha, cargo }: IUsuarioRequest): Promise<Usuario> {
    if (!senha) throw new AppError("Senha obrigatória");

    const emailExists = await this.repository.findOneBy({ email });
    if (emailExists) throw new AppError("E-mail já cadastrado");

    const passwordHash = await hash(senha, 10);

    const usuario = this.repository.create({
      nome,
      email,
      senha: passwordHash,
      cargo,
    });

    await this.repository.save(usuario);
    return usuario;
  }

  async listAll(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async listOne(id: number): Promise<Usuario> {
    const usuario = await this.repository.findOneBy({ id });

    if (!usuario) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return usuario;
  }

  async update(id: number, data: Partial<IUsuarioRequest>): Promise<Usuario> {
    const usuario = await this.listOne(id);

    if (data.cargo) {
      const roles = ["Tecnico", "Supervisor", "Gestor"];
      if (!roles.includes(data.cargo)) {
        throw new AppError("Cargo inválido");
      }
    }

    Object.assign(usuario, data);

    await this.repository.save(usuario);
    return usuario;
  }

  async delete(id: number): Promise<void> {
    const usuario = await this.listOne(id);
    
    usuario.ativo = false; 
    await this.repository.save(usuario);
  }
}