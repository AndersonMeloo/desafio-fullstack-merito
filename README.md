# Dashboard de Investimentos

## Visão geral

- Backend em NestJS, TypeScript com Prisma e PostgreSQL.
- Frontend em React + Vite na pasta [frontend](frontend).
- API com prefixo global em http://localhost:3000/api.
- Validação de entrada com mensagens em português.

## Estrutura

- [src](src): backend NestJS.
- [prisma/schema.prisma](prisma/schema.prisma): modelo do banco.
- [frontend](frontend): interface web do dashboard.
- [Routes](Routes): exemplos de uso das rotas da API.

## Requisitos

- Node.js 22 ou superior.
- PostgreSQL disponível localmente ou em um serviço remoto.
- npm.

## Banco de dados (PostgreSQL + Prisma)

Este projeto utiliza PostgreSQL com Prisma.

### 🐳 Opção 1 — Docker (RECOMENDADO)

```bash
docker-compose up -d
```

**Configure o .env:**
```
DATABASE_URL="postgresql://postgres:postgres@db:5432/dashboard_investments"
```

### 🖥️ Opção 2 — PostgreSQL local

```sql
CREATE DATABASE dashboard_investments;
```

**Configure o .env:**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dashboard_investments"
```

## Configuração inicial (Prisma)

Use o arquivo .env.example como base e crie um .env

Instale dependências:

```bash
npm install
```

Instale Prisma (já incluído em package.json):

```bash
npm install @prisma/client class-validator class-transformer
npm install -D prisma
npx prisma generate
```

Rode migrations:

```bash
npx prisma migrate dev --name init
```

Ou (opcional):

```bash
npx prisma db push
```

## Como executar

### Backend

Em um terminal na raiz do projeto:

```bash
npm run start:dev
```

O servidor sobe em http://localhost:3000 e expõe a API em http://localhost:3000/api.

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite normalmente abre em http://localhost:5173.

Se quiser apontar o frontend para outro backend, defina VITE_API_BASE_URL. Quando essa variável não existe, o frontend usa http://localhost:3000/api.

## Funcionalidades

- Cadastro, listagem e atualização de fundos.
- Registro de movimentações de aporte e resgate.
- Cálculo de cotas e saldo por fundo.
- Resumo consolidado da carteira.
- Limpeza em massa de fundos e movimentações para ambiente de teste.

## Rotas da API

### Fundos

- POST /api/funds
- GET /api/funds
- PUT /api/funds/:id
- DELETE /api/funds

Exemplo de criação:

```json
{
  "name": "Fundo de Papel, Tijolo, Híbrido e etc..",
  "ticker": "MFII11",
  "type": "FISS, Ações e etc",
  "pricePerShare": 67.96
}
```

### Movimentações

- POST /api/transactions
- GET /api/transactions 
- DELETE /api/transactions

Exemplo de aporte:

```json
{
  "fundId": "a06e0bec-09fb-4fc8-8ba0-681b7c359b37",
  "type": "APORTE",
  "amount": 1000,
  "date": "2026-04-15T12:00:00.000Z"
}
```

Exemplo de resgate:

```json
{
  "fundId": "a06e0bec-09fb-4fc8-8ba0-681b7c359b37",
  "type": "RESGATE",
  "amount": 500
}
```

### Carteira

- GET /api/wallet/summary

## Respostas da API

A API retorna objetos com message e data.

O frontend consome esse formato diretamente.

## Docker

O Dockerfile prepara a imagem do backend, instala dependências, compila o NestJS e executa a aplicação em produção na porta 3000.

```bash
docker build -t dashboard-backend .
docker run -p 3000:3000 --env-file .env dashboard-backend
```

## Observações

- O modelo Prisma usa TransactionType com os valores APORTE e RESGATE.
- O resumo da carteira considera apenas posições com saldo positivo.
- O ticker do fundo é normalizado para maiúsculas no cadastro.
