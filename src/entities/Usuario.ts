import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToMany 
} from "typeorm";
import { PlanoManutencao } from "./PlanoManutencao.js";
import { ExecucaoManutencao } from "./ExecucaoManutencao.js";
import { Perfil } from "../types/Perfil.js";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, unique: true })
  nome!: string;

  @Column({ type: "varchar", unique: true, nullable: false, })
  email!: string; 

  @Column({ type: "varchar", nullable: false, select: false })
  senha_hash!: string; 

  @Column({ type: "enum", enum: Perfil, nullable: false })
  perfil!: Perfil;

  @Column({ type: "boolean", default: true })
  ativo!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  criado_em!: Date; 

  @OneToMany(() => PlanoManutencao, (plano) => plano.tecnico)
  planos_padrao!: PlanoManutencao[];

  @OneToMany(() => ExecucaoManutencao, (exec) => exec.tecnico)
  execucoes_realizadas!: ExecucaoManutencao[];
}