import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from "typeorm";
import { Equipamento } from "./Equipamento";
import { ExecucaoManutencao } from "./ExecucaoManutencao";
import { Usuario } from "./Usuario";

@Entity("planos_manutencao")
export class PlanoManutencao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  equipamento_id: number;

  @ManyToOne(() => Equipamento, (equipamento) => equipamento.planos)
  @JoinColumn({ name: "equipamento_id" })
  equipamento: Equipamento;

  @Column()
  titulo: string; // Ex: Lubrificação Geral [cite: 40]

  @Column({ type: "text", nullable: true })
  descricao: string; // Instruções detalhadas [cite: 40]

  @Column()
  periodicidade_days: number; // Intervalo em dias entre execuções [cite: 40]

  @Column()
  tecnico_id: number; // Técnico responsável padrão [cite: 40]

  @ManyToOne(() => Usuario, (usuario) => usuario.planos_padrao)
  @JoinColumn({ name: "tecnico_id" })
  tecnico: Usuario;

  @Column({ type: "date" })
  proxima_em: Date; // Data calculada para a próxima execução [cite: 40]

  @Column({ default: true })
  ativo: boolean; // Planos inativos não aparecem no calendário [cite: 40]

  @OneToMany(() => ExecucaoManutencao, (execucao) => execucao.plano)
  execucoes: ExecucaoManutencao[];
}