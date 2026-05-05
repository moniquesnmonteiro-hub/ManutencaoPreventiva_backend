import { appDataSource } from "../database/appDataSource.js";
import { Equipamento } from "../entities/Equipamento.js";
import { AppError } from "../errors/AppError.js";

export class EquipamentoService {
  private repository = appDataSource.getRepository(Equipamento);

  async create(data: Partial<Equipamento>): Promise<Equipamento> {
    const codigoExists = await this.repository.findOneBy({ codigo: data.codigo });
    if (codigoExists) throw new AppError("Código de equipamento já cadastrado");

    const equipamento = this.repository.create({
      ...data,
      criado_em: new Date()
    });

    await this.repository.save(equipamento);
    return equipamento;
  }

  async listAll(): Promise<Equipamento[]> {
    return await this.repository.find({ order: { nome: "ASC" } });
  }

  async listOne(id: string): Promise<Equipamento> {
    const equipamento = await this.repository.findOne({
      where: { id: id as any },
      relations: ["planos"]
    });

    if (!equipamento) {
      throw new AppError("Equipamento não encontrado", 404);
    }

    return equipamento;
  }

  async update(id: string, data: Partial<Equipamento>): Promise<Equipamento> {
    const equipamento = await this.listOne(id);
    Object.assign(equipamento, data);
    await this.repository.save(equipamento);
    return equipamento;
  }

  async delete(id: string): Promise<void> {
    const equipamento = await this.listOne(id);
    equipamento.ativo = false;
    await this.repository.save(equipamento);
  }
}