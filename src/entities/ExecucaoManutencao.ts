import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from "typeorm";
import { PlanoManutencao } from "./PlanoManutencao";
import { Usuario } from "./Usuario";

@Entity("execucoes_manutencao")
export class ExecucaoManutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plano_id: number;

  @ManyToOne(() => PlanoManutencao, (plano) => plano.execucoes)
  @JoinColumn({ name: "plano_id" })
  plano: PlanoManutencao;

  @Column()
  tecnico_id: number; 

  @ManyToOne(() => Usuario, (usuario) => usuario.execucoes_realizadas)
  @JoinColumn({ name: "tecnico_id" })
  tecnico: Usuario;

  @Column({ type: "date" })
  data_execucao: Date; 

  @Column({ 
    type: "enum", 
    enum: ["realizada", "parcial", "nao_realizada"] 
  })
  status: string;

  @Column()
  conformidade: boolean; 

  @Column({ type: "text", nullable: true })
  observacoes: string; 

  @CreateDateColumn({ type: "timestamptz" })
  timestamp: Date; 
}