import { hash } from "bcrypt";
import { appDataSource } from "../database/appDataSource.js"; 
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";
import { Perfil } from "../types/Perfil.js";

interface IUsuarioRequest {
  nome: string;
  email: string;
  senha?: string;
  perfil: Perfil;
  ativo?: boolean;
}

export class UsuarioService {
  private repository = appDataSource.getRepository(Usuario);

  async create({ nome, email, senha, perfil }: IUsuarioRequest): Promise<Usuario> {
    if (!senha) throw new AppError("Senha obrigatória");

    const emailExists = await this.repository.findOneBy({ email });
    if (emailExists) throw new AppError("E-mail já cadastrado");

    const passwordHash = await hash(senha, 10);

    const usuario = this.repository.create({
      nome,
      email,
      senha_hash: passwordHash,
      perfil,
    });

    await this.repository.save(usuario);
    return usuario;
  }

  async listAll(search?: string): Promise<Usuario[]> {
    if (search) {
      // Filtra técnicos ativos cujo nome contenha o termo buscado (case-insensitive).
      return await this.repository
        .createQueryBuilder('usuario')
        .where('LOWER(usuario.nome) LIKE LOWER(:search)', { search: `%${search}%` })
        .andWhere('usuario.ativo = true')
        .select(['usuario.id', 'usuario.nome', 'usuario.perfil'])
        .getMany();
    }
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

    if (data.perfil) {
      const roles = [Perfil.TECNICO, Perfil.SUPERVISOR, Perfil.GESTOR];
      if (!roles.includes(data.perfil)) {
        throw new AppError("Perfil inválido");
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