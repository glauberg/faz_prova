# CLAUDE.md
## Sobre o projeto
[O Gestor de Provas é um monorepo web para auxiliar professores na criação, correção e organização de avaliações. A aplicação permite a criação de questionários de questões discursivas, múltipla escolha, dicotômicas e resposta única.]
## Próxima etapa (planejada)
[As Funcionalidades A (criação de questionário) e B (correção de questões objetivas) já estão implementadas — ver `docs/status-requisitos.md`. A persistência (Prova e ResultadoProva) via Supabase/Prisma também já está implementada — ver seção "API (backend)" abaixo. Os scripts de dados de demonstração (`povoar`/`limpar`) também já estão implementados — ver seção "Comandos" abaixo. Itens abaixo continuam fora de escopo:]
- [Autenticação.]
- [Exportação de provas para PDF.]
- [Correção automática de questões discursivas usando IA.]
- [Geração de feedback textual automático.]
## Estrutura do monorepo
[Um único app Next.js (App Router) hospeda frontend e backend — sem microsserviços, sem repositórios/deploys separados:]
- [`src/domain/`] -> [Lógica de negócio pura (tipos e validações de `Prova`, `Questao`, `RespostaAluno`, `ResultadoProva`, e a correção). Sem dependência de framework web nem de Prisma.]
- [`src/persistence/`] -> [Camada de persistência: instância do Prisma Client e repositórios (ex.: `provaRepository`, `resultadoRepository`). Único ponto de acesso ao banco (Supabase/Postgres).]
- [`src/app/api/`] -> [Backend HTTP: API routes do Next.js que expõem `domain` + `persistence`. Não contém regra de negócio, só orquestra.]
- [`src/app/**/page.tsx`] -> [Frontend: páginas e componentes React. Consomem apenas as API routes, nunca importam `src/persistence` diretamente.]
- [`prisma/schema.prisma`] -> [Modelos do banco de dados, isolados no schema Postgres `gestor_provas` (não em `public`, que já é usado pelo próprio Supabase). Não contém mais a URL de conexão (movida para `prisma.config.ts` no Prisma 7).]
- [`prisma.config.ts`] -> [Configuração do Prisma CLI (schema, migrations). Usa `DIRECT_URL` para comandos como `migrate`; `PrismaClient` em runtime usa `DATABASE_URL` (pooled) via `@prisma/adapter-pg`, configurado em `src/persistence/prisma.ts`.]
- [`src/generated/prisma/`] -> [Prisma Client gerado (`npm run db:generate`). Não é versionado (`.gitignore`) nem editado manualmente.]
- [`src/cli.ts`] -> [Script de demonstração via terminal, independente do app Next.js.]
- [`src/dadosDemonstracao.ts`] -> [Conjunto fixo de provas/respostas de demonstração usado pelo script `povoar`. Puro `domain`, sem Prisma.]
- [`src/povoar.ts` / `src/limpar.ts`] -> [Scripts de terminal que populam e limpam a base de demonstração via `persistence`.]
## API (backend)
[Rotas em `src/app/api/`, cada uma só orquestrando `domain` + `persistence` (sem regra de negócio própria):]
- [`POST /api/provas`] -> [Valida (`montarProva`) e persiste uma prova. 400 se inválida.]
- [`GET /api/provas/:id`] -> [Recupera uma prova salva. 404 se não existir.]
- [`POST /api/provas/:id/correcoes`] -> [Corrige (`corrigirProva`) e persiste o resultado para um aluno. 404 se a prova não existir.]
- [`GET /api/resultados/:id`] -> [Recupera um resultado de correção salvo. 404 se não existir.]
## Comandos
- [npm install] -> [Instala as dependências do projeto.]
- [npm run dev] -> [Inicia a aplicação em modo de desenvolvimento.]
- [npm run build] -> [Gera a versão de produção da aplicação.]
- [npm test] -> [Roda os testes automatizados (`node --test`) sobre `src/**/*.test.ts`.]
- [npm run typecheck] -> [Verifica erros de tipo com `tsc --noEmit`, sem gerar arquivos.]
- [npm run lint] -> [Verifica problemas de qualidade e padronização do código com Biome (lint + formatação).]
- [npm run lint:fix] -> [Aplica as correções automáticas do Biome.]
- [npm run db:migrate] -> [Cria/aplica migrações do schema Prisma no Supabase (usa `--env-file=.env.local`; a conexão para o CLI vem de `DIRECT_URL`, configurada em `prisma.config.ts`).]
- [npm run db:generate] -> [Gera o Prisma Client (`src/generated/prisma`) a partir do schema. Não precisa de conexão com o banco — roda também no CI. Executado automaticamente no `postinstall`.]
- [npm run db:studio] -> [Abre o Prisma Studio para inspecionar o banco (usa `--env-file=.env.local`).]
- [npm run povoar] -> [Popula o banco com provas e resultados de demonstração fixos (`src/dadosDemonstracao.ts`), usando `--env-file=.env.local`.]
- [npm run limpar] -> [Remove todas as provas, questões e resultados do banco (usa `--env-file=.env.local`).]
## Convenções de código
- [Utilizar TypeScript como linguagem principal.]
- [Utilizar nomes de variáveis, funções e componentes que expressem claramente sua finalidade.]
- [Preferir funções pequenas, com uma única responsabilidade.]
- [Evitar duplicação de código.]
- [Manter componentes de interface separados da lógica de negócio.]
- [Utilizar camelCase para variáveis e funções e PascalCase para componentes e tipos.]
- [Não introduzir bibliotecas ou frameworks adicionais sem necessidade.]
- [Toda nova funcionalidade relevante deve possuir pelo menos um teste automatizado.]
- [Comentários devem explicar decisões ou regras de negócio, e não repetir o que o código já deixa evidente.]
- [Acesso ao banco de dados (Supabase/Postgres) deve passar exclusivamente pelo Prisma Client, isolado em uma camada de persistência própria, sem regras de negócio misturadas.]
- [Credenciais e URL de conexão do Supabase ficam em variáveis de ambiente (`.env.local`, fora do controle de versão), nunca hardcoded.]
- [Fazer um carrossel de LLMs para responder as questões discursivas, usando as chaves em '.env.local']
- [Mensagens de commit seguem Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `ci:`, ...), validado automaticamente pelo hook `commit-msg` do husky + commitlint.]
## Não fazer
- [Não introduzir arquitetura de microsserviços.]
- [Não escrever SQL cru fora do schema/migrações do Prisma.]
- [Não versionar arquivos `.env` ou credenciais do Supabase.]
- [Não adicionar bibliotecas apenas para resolver problemas simples que podem ser tratados com código nativo.]
- [Não alterar funcionalidades existentes sem verificar os testes.]
- [Não misturar regras de negócio diretamente nos componentes de interface.]
- [Não implementar funcionalidades futuras apenas porque elas estão previstas no roadmap.]
- [Não modificar configurações de infraestrutura sem necessidade explícita.]
- [Não criar mocks para dados.]

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
