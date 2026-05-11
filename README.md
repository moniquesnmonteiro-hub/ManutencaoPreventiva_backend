# PreventivaPIM — Backend

API REST do sistema de gestão de manutenção preventiva desenvolvido para o **Polo Industrial de Manaus (PIM)**.

---

## Tecnologias

| | |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| ORM | TypeORM |
| Banco de Dados | PostgreSQL (Docker) |
| Autenticação | JWT (access token 15min + refresh token 7 dias) |
| Validação | Zod |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) e Docker Compose

---

## Configuração e execução

### 1. Banco de dados (Docker)

Na raiz do projeto (`projeto_final/`), suba o PostgreSQL e o pgAdmin:

```bash
docker-compose up -d
```

Isso cria:
- **PostgreSQL** na porta `5432` com o banco `preventiva_db` já configurado
- **pgAdmin** em `http://localhost:8080` — login: `admin@admin.com` / `123456`

Para parar os containers:

```bash
docker-compose down
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Variáveis de ambiente

Crie o arquivo `.env` na raiz do Backend:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=preventiva_db
PORT=3000
JWT_ACCESS_SECRET=seu_secret_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_aqui
```

### 4. Iniciar o servidor

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.

> O TypeORM está configurado com `synchronize: true` — as tabelas são criadas automaticamente na primeira execução.

---

## Estrutura

```
src/
├── controllers/   # Recebe e responde as requisições HTTP
├── services/      # Regras de negócio
├── entities/      # Modelos do banco de dados (TypeORM)
├── routes/        # Definição das rotas da API
├── middleware/    # Autenticação, validação, controle de acesso
├── dtos/          # Schemas de validação (Zod)
├── errors/        # Tratamento de erros centralizado
└── types/         # Enums e tipos compartilhados
```

---

## Perfis de acesso

| Perfil | Valor | Permissões |
|---|---|---|
| Técnico | `0` | Registrar execuções, visualizar calendário e planos |
| Supervisor | `1` | Tudo do Técnico + gerenciar equipamentos e planos |
| Gestor | `2` | Acesso total + cadastrar novos usuários |

---

## Rotas da API

### Autenticação — `/api/auth`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/login` | Autenticar usuário |
| POST | `/refresh` | Renovar access token com refresh token |
| POST | `/logout` | Encerrar sessão e invalidar refresh token |

### Usuários — `/api/usuarios` 🔒

| Método | Rota | Descrição | Perfil mínimo |
|---|---|---|---|
| GET | `/` | Listar todos os usuários | Todos |
| GET | `/:id` | Buscar usuário por ID | Todos |
| POST | `/` | Criar novo usuário | Gestor |
| PUT | `/:id` | Atualizar usuário | Todos |
| PATCH | `/me` | Atualizar próprio nome/senha | Todos |
| DELETE | `/:id` | Remover usuário | Todos |

### Equipamentos — `/api/equipamentos` 🔒

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Listar equipamentos |
| GET | `/:id` | Buscar equipamento por ID |
| POST | `/` | Cadastrar equipamento |
| PUT | `/:id` | Atualizar equipamento |
| DELETE | `/:id` | Remover equipamento |

### Planos de Manutenção — `/api/planos` 🔒

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Listar planos ativos |
| GET | `/:id` | Buscar plano por ID |
| GET | `/equipamento/:id` | Listar planos de um equipamento |
| POST | `/` | Criar plano |
| PUT | `/:id` | Atualizar plano |
| DELETE | `/:id` | Desativar plano |

### Execuções — `/api/execucoes` 🔒

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Listar todas as execuções |
| GET | `/plano/:id` | Listar execuções de um plano |
| POST | `/` | Registrar execução |

### Dashboard — `/api/dashboard/summary` 🔒

Retorna indicadores: manutenções atrasadas, próximas nos 7 dias, realizadas no mês e conformidade do mês.

### Calendário — `/api/calendario` 🔒

Retorna a visão cronológica dos planos com técnico responsável e último executor.

---

## Modelo de dados

```
Usuário (1) ──── (N) Execução
Usuário (1) ──── (N) Plano (técnico padrão)
Usuário (1) ──── (N) Sessão

Equipamento (1) ──── (N) Plano
Plano       (1) ──── (N) Execução
```

---

## Autor

Desenvolvido por **Monique** — Projeto Final INDT Educacional · 2026
