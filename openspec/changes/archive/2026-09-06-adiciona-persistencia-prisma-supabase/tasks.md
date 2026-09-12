## 1. Configuração do Supabase e Prisma

- [x] 1.1 Criar projeto no Supabase e obter a URL de conexão do Postgres (projeto já existia, credenciais em `.env.local`)
- [x] 1.2 Instalar `prisma`, `@prisma/client` e `@prisma/adapter-pg`, e inicializar `prisma/schema.prisma`
- [x] 1.3 Configurar `DATABASE_URL`/`DIRECT_URL` (já estavam em `.env.local`, fora do controle de versão)

## 2. Schema Prisma

- [x] 2.1 Modelar `Prova` e `Questao` (com discriminador de tipo) refletindo os tipos existentes em `src/domain/prova.ts` e `src/domain/questao.ts`
- [x] 2.2 Modelar `ResultadoProva` e `ResultadoQuestao` refletindo os tipos existentes em `src/domain/resposta.ts`, com relação obrigatória para uma `Prova` salva
- [x] 2.3 Gerar e aplicar a migração inicial e verificar que `prisma generate` roda sem erros

## 3. Camada de persistência da prova

- [x] 3.1 Implementar, em `src/persistence/provaRepository.ts`, a função de salvar uma `Prova` validada via Prisma Client
- [x] 3.2 Implementar a função de recuperar uma `Prova` por identificador, tratando identificador inexistente sem lançar erro não tratado
- [ ] 3.3 Testes automatizados cobrindo os cenários de persistência — verificados manualmente via `POST`/`GET /api/provas` contra o Supabase real (ver seção "Revisão" abaixo), mas sem teste automatizado no `node --test`

## 4. Camada de persistência do resultado de correção

- [x] 4.1 Implementar a função de salvar um `ResultadoProva` associado a uma prova persistida e a um identificador de aluno
- [x] 4.2 Implementar a rejeição de um `ResultadoProva` que referencie uma prova inexistente no banco (`ProvaNaoEncontradaError`)
- [x] 4.3 Implementar a função de recuperar um `ResultadoProva` por identificador, tratando identificador inexistente sem lançar erro não tratado
- [ ] 4.4 Testes automatizados cobrindo os cenários de persistência — mesma situação da tarefa 3.3

## 5. Verificação final

- [x] 5.1 Rodar `npm test`, `npx tsc --noEmit` e `npm run lint`, e confirmar que a camada de persistência não altera o comportamento das Funcionalidades A e B já existentes
- [x] 5.2 Confirmar que nenhuma credencial do Supabase foi versionada (`.env.local` seguiu ignorado; `git status` revisado antes de cada commit)

---

## Revisão (desvios do plano original, com justificativa)

- **Schema isolado (`gestor_provas`), não implícito em `public`.** O plano original não previa isso; foi decidido durante a implementação, a pedido explícito, para não colidir com as schemas `auth`/`public` que o próprio Supabase já usa (confirmado por introspecção antes de migrar).
- **Baseline manual em vez de `prisma migrate dev`.** O Prisma 7 mudou a configuração de conexão (saiu de `schema.prisma` para `prisma.config.ts`), e `migrate dev` recusa rodar (erro P3005) num banco que já tem tabelas em `auth`/`public`, mesmo sendo schemas fora do `multiSchema` configurado. A migração inicial foi gerada via `prisma migrate diff --from-empty`, aplicada manualmente (`prisma db execute`) e registrada via `prisma migrate resolve --applied`, com confirmação explícita antes de executar contra o banco real.
- **Tarefas 3.3 e 4.4 (testes automatizados) ficaram pendentes.** O `CLAUDE.md` proíbe mocks para dados ("Não criar mocks para dados"), e não há infraestrutura de banco de dados de teste isolado nem credenciais no CI — só existem no `.env.local` local. A verificação foi feita manualmente, de ponta a ponta, contra o Supabase real (criar prova → buscar → corrigir → buscar resultado, incluindo os casos de erro 400/404), com os dados de teste removidos do banco em seguida. Testes automatizados de persistência ficam como trabalho futuro, condicionados a uma decisão sobre banco de dados de teste (ex.: schema Postgres dedicado a testes, ou banco efêmero no CI).
