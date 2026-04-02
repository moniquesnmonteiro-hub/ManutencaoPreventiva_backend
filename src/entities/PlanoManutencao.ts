import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from "typeorm";
import { Equipamento } from "./Equipamento.js";
import { ExecucaoManutencao } from "./ExecucaoManutencao.js";
import { Usuario } from "./Usuario.js";

@Entity("planos_manutencao")
export class PlanoManutencao {
  
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  equipamento_id!: string;

  @ManyToOne(() => Equipamento, (equipamento: Equipamento) => equipamento.planos)
  @JoinColumn({ name: "equipamento_id" })
  equipamento!: Equipamento;

  @Column({ type: "varchar", nullable: false })
  titulo!: string; 

  @Column({ type: "text", nullable: true })
  descricao?: string; 

  @Column({ type: "int", nullable: false })
  periodicidade_days!: number; 

  @Column({ type: "uuid" })
  tecnico_id!: string; 

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.planos_padrao)
  @JoinColumn({ name: "tecnico_id" })
  tecnico!: Usuario;

  @Column({ type: "date", nullable: false })
  proxima_em!: Date; 

  @Column({ type: "boolean", default: true })
  ativo!: boolean; 

  @OneToMany(() => ExecucaoManutencao, (execucao: ExecucaoManutencao) => execucao.plano)
  execucoes!: ExecucaoManutencao[];
}