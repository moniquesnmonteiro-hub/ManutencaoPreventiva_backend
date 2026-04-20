import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn,
  JoinColumn 
} from "typeorm";
import { Usuario } from "./Usuario.js";

@Entity("sessoes")
export class Sessao {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;

  @Column({ type: "text", nullable: false })
  refresh_token_hash!: string;

  @Column({ type: "timestamptz", nullable: false })
  expires_at!: Date;

  @Column({ type: "timestamptz", nullable: true })
  revoked_at!: Date | null;

  @Column({ type: "text", nullable: true })
  ip?: string | null;

  @Column({ type: "text", nullable: true })
  user_agent?: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  created_at!: Date;
}