# Gestor de Provas

Aplicação web para auxiliar professores na criação, correção e organização de avaliações. Permite montar questionários com questões discursivas, múltipla escolha, dicotômicas e de resposta única, corrigir automaticamente as questões objetivas e exportar provas para PDF.

Monorepo único: um app [Next.js](https://nextjs.org) (App Router) hospeda frontend e backend, sem microsserviços.

## Funcionalidades

- **Banco de questões**: cadastro, edição, listagem (com filtro por tema/tipo) e remoção de questões reutilizáveis.
- **Criação de provas**: montagem de uma prova a partir de questões selecionadas do banco.
- **Geração de questões por IA**: a partir de tema e referência bibliográfica, usando um carrossel round-robin com fallback entre provedores de LLM (OpenRouter, Groq).
- **Correção automática**: questões `multipla-escolha`, `dicotomica` e `resposta-unica` são corrigidas automaticamente; questões `discursiva` ficam pendentes de correção manual.
- **Exportação para PDF**: página formatada para impressão (com opção de incluir gabarito), sem biblioteca adicional — usa o diálogo nativo de impressão do navegador.
- **Autenticação de professor**: login por usuário/senha, sessão via cookie httpOnly assinado.

### Tipos de questão objetiva

- `multipla-escolha`: uma ou mais alternativas podem ser marcadas como corretas; o aluno responde marcando um subconjunto (checkboxes) e só acerta se marcar exatamente o mesmo conjunto do gabarito.
- `resposta-unica`: exatamente uma alternativa correta entre uma lista; o aluno escolhe uma única opção (select).
- `dicotomica`: verdadeiro ou falso.
- `discursiva`: resposta livre, sem correção automática.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React
- TypeScript
- [Prisma](https://www.prisma.io) + Postgres (via [Supabase](https://supabase.com))
- [Biome](https://biomejs.dev) (lint e formatação)
- `node --test` para testes automatizados

## Pré-requisitos

- Node.js
- Um projeto Supabase (ou outro Postgres) para o banco de dados

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env.local` na raiz do projeto com as variáveis de ambiente necessárias (não versionado):

   - `DATABASE_URL` — string de conexão pooled do Postgres (usada em runtime pelo Prisma Client)
   - `DIRECT_URL` — string de conexão direta do Postgres (usada pelo Prisma CLI, ex.: migrations)
   - `AUTH_SECRET` — segredo usado para assinar o cookie de sessão (HMAC-SHA256)
   - Chaves de API dos provedores de LLM (OpenRouter e/ou Groq), necessárias apenas para a geração de questões por IA

3. Aplique as migrações do schema no banco:

   ```bash
   npm run db:migrate
   ```

4. (Opcional) Popule o banco com dados de demonstração — professor, 25 questões e 2 provas prontas:

   ```bash
   npm run povoar
   ```

   Usuário de demonstração criado: `profteste` / senha `prof123`.

## Uso

```bash
npm run dev
```

Acesse `http://localhost:3000`. Todas as páginas exigem login, exceto `/login`.

## Scripts

| Comando              | Descrição                                                                 |
| --------------------- | -------------------------------------------------------------------------- |
| `npm install`          | Instala as dependências do projeto.                                        |
| `npm run dev`          | Inicia a aplicação em modo de desenvolvimento.                             |
| `npm run build`        | Gera a versão de produção da aplicação.                                    |
| `npm start`            | Inicia a aplicação já buildada.                                            |
| `npm test`             | Roda os testes automatizados (`node --test`) sobre `src/**/*.test.ts`.     |
| `npm run typecheck`    | Verifica erros de tipo com `tsc --noEmit`.                                 |
| `npm run lint`         | Verifica problemas de qualidade e padronização do código com Biome.        |
| `npm run lint:fix`     | Aplica as correções automáticas do Biome.                                  |
| `npm run db:migrate`   | Cria/aplica migrações do schema Prisma no banco.                           |
| `npm run db:generate`  | Gera o Prisma Client a partir do schema (executado no `postinstall`).      |
| `npm run db:studio`    | Abre o Prisma Studio para inspecionar o banco.                             |
| `npm run povoar`       | Popula o banco com professor, questões e provas de demonstração.           |
| `npm run limpar`       | Remove todas as provas, questões, resultados e professores do banco.       |
| `npm run cli`          | Executa o script de demonstração via terminal (`src/cli.ts`).              |

## Estrutura do projeto

```
src/
  domain/            lógica de negócio pura (Prova, Questao, correção, auth, geração de questões)
  persistence/        Prisma Client e repositórios — único ponto de acesso ao banco
  app/api/            API routes do Next.js (orquestram domain + persistence)
  app/**/page.tsx      páginas e componentes React, consomem apenas as API routes
  integracoes/llm/     integração com provedores de IA (OpenRouter, Groq) e carrossel round-robin
  app/_auth/           camada HTTP de sessão (cookie, professor autenticado)
  proxy.ts             verificação otimista de sessão, redireciona para /login
  cli.ts               script de demonstração via terminal
  dadosDemonstracao.ts banco de questões e provas de demonstração
  povoar.ts / limpar.ts scripts de terminal para popular/limpar o banco de demonstração
prisma/schema.prisma   modelos do banco de dados (schema Postgres `gestor_provas`)
```

Veja detalhes arquiteturais completos, contrato de cada rota da API e as convenções de código em [`CLAUDE.md`](./CLAUDE.md).

## Testes

```bash
npm test
```

## Documentação adicional

- [`CLAUDE.md`](./CLAUDE.md) — visão geral da arquitetura, API e convenções.
- [`docs/status-requisitos.md`](./docs/status-requisitos.md) — status dos requisitos implementados.
- [`docs/escopo.md`](./docs/escopo.md) — escopo do projeto.
