import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PlanoManutencao } from "./PlanoManutencao.js";

@Entity("equipamentos")
export class Equipamento {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ type: "varchar", unique: true, nullable: false })
  codigo!: string;

  @Column({type: "varchar", nullable: false})
  nome!: string;

  @Column({type: "varchar", nullable: false})
  tipo!: string;

  @Column({type: "varchar", nullable: false})
  localizacao!: string; 

  @Column({type: "varchar", nullable: true })
  fabricante?: string;

  @Column({ type: "varchar", nullable: true })
  modelo?: string;

  @Column({type: "boolean", default: true })
  ativo!: boolean;

  @Column({ type: "timestamptz" })
  criado_em!: Date;

  @OneToMany(() => PlanoManutencao, (plano) => plano.equipamento)
  planos!: PlanoManutencao[];
}