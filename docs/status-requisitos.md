# Status dos Requisitos

* **Projeto:** faz_prova
* **Data:** 11/09/2026
* **Fontes:** `docs/etapa2-funcionalidades.md`, `openspec/specs/criacao-questionario/spec.md`, `docs/spec-manual/correcao-questoes/spec.md`, `openspec/changes/archive/2026-09-06-adiciona-persistencia-prisma-supabase`

Este documento consolida os requisitos planejados para as duas funcionalidades do escopo da atividade (ver `docs/escopo.md`), indicando o que já foi implementado e o que ficou pendente.

## Funcionalidade A — Criação de questionário

Spec: `openspec/specs/criacao-questionario/spec.md` · Código: `src/questao.ts`, `src/prova.ts` · Testes: `src/prova.test.ts`, `src/questao.test.ts`

### Requisitos implementados

- [x] Montar uma `Prova` a partir de título e lista de `Questao`
- [x] Rejeitar prova sem nenhuma questão
- [x] Aceitar questão `discursiva` com apenas enunciado, sem gabarito/alternativas
- [x] Exigir, para `multipla-escolha`: enunciado, ≥2 alternativas e gabarito correspondente a uma delas
- [x] Rejeitar `multipla-escolha` sem alternativas ou com apenas uma
- [x] Rejeitar `multipla-escolha` com gabarito que não corresponde a nenhuma alternativa
- [x] Exigir, para `dicotomica`: enunciado e gabarito booleano (verdadeiro/falso)
- [x] Rejeitar `dicotomica` sem gabarito
- [x] Exigir, para `resposta-unica`: enunciado e gabarito textual
- [x] Rejeitar `resposta-unica` sem gabarito
- [x] Rejeitar qualquer questão, de qualquer tipo, com enunciado ausente ou vazio

### Requisitos pendentes

Nenhum requisito da spec `criacao-questionario` ficou pendente.

## Funcionalidade B — Correção de questões objetivas

Spec: `docs/spec-manual/correcao-questoes/spec.md` · Código: `src/resposta.ts`, `src/correcao.ts` · Testes: `src/correcao.test.ts`

### Requisitos implementados

- [x] R1 — Calcular quantas questões objetivas o aluno acertou, dada uma `Prova` com gabarito e as respostas do aluno
- [x] R2 — Tratar como objetivas as questões `multipla-escolha`, `dicotomica` e `resposta-unica`
- [x] R3 — Questões `discursiva` nunca são corrigidas automaticamente; aparecem como "pendente de correção manual"
- [x] R4 — Resultado contém nota das objetivas (acertos/total) e detalhamento por questão (acertou/errou/pendente)
- [x] R5 — Questão objetiva sem resposta do aluno conta como errada
- [x] R6 — Resposta para questão inexistente na prova é ignorada, sem quebrar a correção
- [x] R7 — Prova só com questões discursivas retorna 0 acertos de 0 objetivas, sem erro
- [x] Robustez adicional (não exigida por cenário formal, decidida na revisão de diff): `.trim()` na comparação de `resposta-unica`, para tolerar espaços extras na resposta do aluno

### Requisitos pendentes

Nenhum requisito da spec `correcao-questoes` ficou pendente.

## Persistência (Prova e ResultadoProva)

Change: `openspec/changes/archive/2026-09-06-adiciona-persistencia-prisma-supabase` · Código: `src/persistence/` (`prisma.ts`, `provaRepository.ts`, `resultadoRepository.ts`) · Schema: `prisma/schema.prisma`

### Requisitos implementados

- [x] Persistir uma `Prova` (com suas `Questao`) no Postgres via Supabase, isolado no schema `gestor_provas`
- [x] Persistir um `ResultadoProva` (com o detalhamento por `ResultadoQuestao`) associado a uma `Prova` existente
- [x] Recuperar uma `Prova` salva pelo id
- [x] Recuperar um `ResultadoProva` salvo pelo id
- [x] Acesso ao banco exclusivamente via Prisma Client, isolado na camada `src/persistence/` (sem SQL cru, sem regra de negócio na camada de persistência)
- [x] Conexão em runtime via `DATABASE_URL` (pooled, `@prisma/adapter-pg`); comandos do Prisma CLI (`migrate`, `studio`) via `DIRECT_URL`, configurados em `prisma.config.ts`
- [x] API HTTP (`src/app/api/`) orquestrando `domain` + `persistence`: `POST /api/provas`, `GET /api/provas/:id`, `POST /api/provas/:id/correcoes`, `GET /api/resultados/:id`
- [x] Frontend mínimo (`src/app/**/page.tsx`) consumindo apenas as API routes: criar prova, ver prova, corrigir, ver resultado

### Requisitos pendentes

Nenhum requisito da change `adiciona-persistencia-prisma-supabase` ficou pendente.

## Dados de demonstração (scripts `povoar` / `limpar`)

Código: `src/dadosDemonstracao.ts`, `src/povoar.ts`, `src/limpar.ts`, `src/persistence/manutencaoRepository.ts` · Testes: `src/dadosDemonstracao.test.ts`

### Requisitos implementados

- [x] `npm run povoar` cria um conjunto fixo de provas de demonstração (com questões dos quatro tipos) e resultados de correção para alunos fictícios, via `persistence`
- [x] `npm run limpar` remove todas as provas, questões e resultados do banco, via `persistence` (`limparBaseDeDemonstracao`)
- [x] Dados de demonstração validados por teste automatizado: cada prova é aceita por `montarProva` e as respostas de cada aluno referenciam apenas questões existentes na prova

### Requisitos pendentes

Nenhum.

## Fora de escopo (decisão documentada, não é pendência)

Os itens abaixo foram deliberadamente excluídos do escopo da atividade em `docs/etapa2-funcionalidades.md` e no `CLAUDE.md` ("Próxima etapa" / "Não fazer") — não representam trabalho faltando, mas limites explícitos do que foi planejado:

- Autenticação
- Exportação de provas para PDF
- Correção automática de questões discursivas usando IA (incluindo o "carrossel de LLMs" previsto nas Convenções do `CLAUDE.md`)
- Geração de feedback textual automático

## Verificação

- `npm test`: 20/20 testes passando, cobrindo todos os cenários de aceite das specs `criacao-questionario` e `correcao-questoes`, além da validade dos dados de demonstração.
- `src/cli.ts` é um script de demonstração manual que integra as Funcionalidades A e B usando apenas funções já testadas; não introduz requisito novo.
- Persistência verificada via `npm run db:migrate` (schema `gestor_provas` aplicado no Supabase) e uso manual das rotas de API.
- `npm run povoar` e `npm run limpar` executados manualmente contra o banco de desenvolvimento (Supabase), confirmando criação e remoção correta dos registros.
