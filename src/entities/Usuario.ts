import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  OneToMany 
} from "typeorm";
import { PlanoManutencao } from "./PlanoManutencao";
import { ExecucaoManutencao } from "./ExecucaoManutencao";
import { Perfil } from "../types/Perfil";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    type: "varchar", 
    nullable: false 
  })
  nome: string;

  @Column({ 
    type: "varchar", 
    unique: true, 
    nullable: false 
  })
  email: string; 

  @Column({ 
    type: "varchar", 
    nullable: false, 
    select: false 
  })
  senha: string; 

  @Column({ 
    type: "enum", 
    enum: ["TECNICO", "SUPERVISOR", "GESTOR"], 
    default: "TECNICO" 
  })
  perfil: Perfil;

  @Column({ 
    type: "boolean", 
    default: true 
  })
  ativo: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  criado_em: Date; 

  @OneToMany(() => PlanoManutencao, (plano) => plano.tecnico)
  planos_padrao!: PlanoManutencao[];

  @OneToMany(() => ExecucaoManutencao, (exec) => exec.tecnico)
  execucoes_realizadas!: ExecucaoManutencao[];
}