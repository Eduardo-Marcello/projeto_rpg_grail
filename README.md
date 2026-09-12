# Tainted Grail — App de Fichas e Mesa Virtual

Webapp para o RPG **Tainted Grail: Song of a Dying World**. Ver
[`../CLAUDE.md`](../CLAUDE.md) para as regras do projeto antes de alterar
qualquer coisa aqui.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Banco de dados

Este projeto usa PostgreSQL (Prisma 7 + driver adapter `pg`). Para
desenvolvimento local sem precisar instalar Postgres, use o Postgres
embutido do próprio Prisma:

```bash
npx prisma dev -d
```

Isso imprime uma connection string (`postgres://postgres:postgres@localhost:PORTA/template1?sslmode=disable`)
— cole em `DATABASE_URL` no seu `.env` (copie de `.env.example` primeiro).
Depois rode as migrations:

```bash
npx prisma migrate dev
```

Em produção, `DATABASE_URL` deve apontar para o Postgres da
[Neon](https://neon.tech) (free tier) — ver `CLAUDE.md` para a decisão de
arquitetura completa.

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha `DATABASE_URL` e
`SESSION_SECRET` (instruções nos comentários do próprio arquivo).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- PostgreSQL via Prisma 7 (driver adapter `pg`)
- Autenticação própria (usuário/senha com `bcryptjs`, sessão via
  `iron-session`)

## Estrutura

- `src/app/(app)/` — área logada (Ficha, Como Jogar, Mesa de Dados, Mestre),
  protegida por `src/lib/dal.ts`.
- `src/app/login`, `src/app/registrar` — páginas públicas de autenticação.
- `src/lib/` — Prisma client, sessão, DAL, ações de autenticação, validações.
- `prisma/schema.prisma` — modelo de dados (ver comentários com as páginas
  do corebook que cada campo implementa).
