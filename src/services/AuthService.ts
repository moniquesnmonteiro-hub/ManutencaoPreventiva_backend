import type { DataSource, Repository } from "typeorm";
import { compare } from "bcryptjs";
import { createHash } from "crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Usuario } from "../entities/Usuario.js";
import { Sessao } from "../entities/Sessao.js";
import { AppError } from "../errors/AppError.js";

export class AuthService {
    private userRepo: Repository<Usuario>;
    private sessionRepo: Repository<Sessao>;

    constructor(dataSource: DataSource) {
        this.userRepo = dataSource.getRepository(Usuario);
        this.sessionRepo = dataSource.getRepository(Sessao);
    }

    private hashToken(token: string): string {
        return createHash("sha256").update(token).digest("hex");
    }

    private gerarAccessToken(usuario: Usuario): string {
        return (jwt.sign as any)(
            { sub: usuario.id, perfil: usuario.perfil },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "15m" }
        );
    }

    private gerarRefreshToken(sessionId: string, userId: string): string {
        return (jwt.sign as any)(
            { sub: userId, sid: sessionId },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );
    }

    async login(email: string, senha: string, meta?: { ip?: string; userAgent?: string }) {
        const usuario = await this.userRepo.findOne({
            where: { email },
            select: ["id", "nome", "email", "senha_hash", "perfil", "ativo"]
        });

        if (!usuario || !usuario.ativo || !(await compare(senha, usuario.senha_hash))) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        const sessao = this.sessionRepo.create({
            usuario,
            refresh_token_hash: "",
            expires_at: new Date(),
            ip: meta?.ip ?? null,
            user_agent: meta?.userAgent ?? null,
        });

        await this.sessionRepo.save(sessao);

        const refreshToken = this.gerarRefreshToken(sessao.id, String(usuario.id));
        sessao.refresh_token_hash = this.hashToken(refreshToken);
        sessao.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.sessionRepo.save(sessao);

        const accessToken = this.gerarAccessToken(usuario);
        const { senha_hash, ...usuarioRetorno } = usuario;
        return { accessToken, refreshToken, usuario: usuarioRetorno };
    }

    async refresh(refreshToken: string) {
        let payload: JwtPayload;
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        } catch {
            throw new AppError("Sessão expirada, faça login novamente", 401);
        }

        const sessao = await this.sessionRepo.findOne({
            where: { id: payload.sid },
            relations: ["usuario"]
        });

        if (!sessao || sessao.revoked_at || sessao.expires_at < new Date()) {
            throw new AppError("Sessão inválida", 401);
        }

        if (sessao.refresh_token_hash !== this.hashToken(refreshToken)) {
            throw new AppError("Token inválido", 401);
        }

        const novoRefreshToken = this.gerarRefreshToken(sessao.id, String(sessao.usuario.id));
        sessao.refresh_token_hash = this.hashToken(novoRefreshToken);
        await this.sessionRepo.save(sessao);

        return { 
            accessToken: this.gerarAccessToken(sessao.usuario), 
            refreshToken: novoRefreshToken, 
            usuario: sessao.usuario 
        };
    }

    async logout(refreshToken: string) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
            const sessao = await this.sessionRepo.findOneBy({ id: payload.sid });
            if (sessao) {
                sessao.revoked_at = new Date();
                await this.sessionRepo.save(sessao);
            }
        } catch {
            return;
        }
    }
}