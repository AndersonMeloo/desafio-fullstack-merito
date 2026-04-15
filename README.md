# Investments
## Visão geral

- Backend em NestJS com Prisma e PostgreSQL.
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

## Configuração inicial

1. Instale as dependências do backend na raiz do projeto.

   ```bash
   npm install
   ```

2. Configure a variável de ambiente do banco de dados.

   Use o arquivo [.env.example](.env.example) como base e crie um [.env](.env) com a URL do PostgreSQL.

3. Inicialize o schema do Prisma.

   ```bash
   npx prisma migrate dev --name init
   ```

   Se preferir apenas sincronizar o schema com o banco em ambiente local, também é possível usar `npx prisma db push`.

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
- Limpeza em massa de fundos e movimentações para ambiente de teste. Funciona somente em Postman, Insomnia e etc..

## Rotas da API
### Fundos

- POST /api/funds
- GET /api/funds
- PUT /api/funds/:id Funciona somente em Postman, Insomnia e etc..
- DELETE /api/funds Funciona somente em Postman, Insomnia e etc..

Exemplo de criação:

```json
{
  "name": "Fundo de Papel, Tijolo, Híbrido e etc..",
  "ticker": "MFII11",
  "type": "FISS, Ações e etc",
  "pricePerShare": 67,96
}
```

### Movimentações
Funciona somente em Postman, Insomnia e etc..
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

A API retorna objetos com `message` e `data`. O frontend consome esse formato diretamente.

## Testes

```bash
npm run test
npm run test:e2e
```

## Docker

O [Dockerfile](Dockerfile) prepara uma imagem para o backend. Ele instala as dependências, compila o NestJS e inicia a aplicação em produção na porta 3000.

## Observações

- O modelo Prisma usa TransactionType com os valores APORTE e RESGATE.
- O resumo da carteira considera apenas posições com saldo positivo.
- O ticker do fundo é normalizado para maiúsculas no cadastro.
