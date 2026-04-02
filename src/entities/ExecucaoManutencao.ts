import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from "typeorm";
import { PlanoManutencao } from "./PlanoManutencao.js";
import { Usuario } from "./Usuario.js";

@Entity("execucoes_manutencao")
export class ExecucaoManutencao {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  plano_id!: string;

  @ManyToOne(() => PlanoManutencao, (plano) => plano.execucoes)
  @JoinColumn({ name: "plano_id" })
  plano!: PlanoManutencao;

  @Column({ type: "uuid" })
  tecnico_id!: string; 

  @ManyToOne(() => Usuario, (usuario) => usuario.execucoes_realizadas)
  @JoinColumn({ name: "tecnico_id" })
  tecnico!: Usuario;

  @Column({ type: "date", nullable: false })
  data_execucao!: Date; 

  @Column({ 
    type: "enum", 
    enum: ["realizada", "parcial", "nao_realizada"],
    default: "realizada"
  })
  status!: string;

  @Column({ type: "boolean", default: true })
  conformidade!: boolean; 

  @Column({ type: "text", nullable: true })
  observacoes?: string; 

  @CreateDateColumn({ type: "timestamptz" })
  timestamp!: Date; 
}