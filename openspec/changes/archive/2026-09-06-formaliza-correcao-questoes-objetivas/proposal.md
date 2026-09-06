## Why

A Funcionalidade B (correção de questões objetivas) foi deliberadamente especificada via Markdown manual em vez de OpenSpec — ver `docs/escopo.md`, que registra a decisão de usar ferramentas diferentes para as Funcionalidades A e B, para comparar OpenSpec x Markdown manual (Etapa 5) sem viesar a comparação usando a mesma ferramenta duas vezes. Por isso essa funcionalidade nunca teve uma capability em `openspec/specs/` — só existe em `docs/spec-manual/correcao-questoes/`.

A funcionalidade já está implementada (`src/domain/correcao.ts`, `src/domain/resposta.ts`), testada (5 cenários em `src/domain/correcao.test.ts`, todos passando) e exposta via API (`POST /api/provas/:id/correcoes`, `GET /api/resultados/:id`). Esta change formaliza essa funcionalidade já existente como uma capability OpenSpec, para que `openspec/specs/` reflita todas as funcionalidades do produto de forma consistente — sem alterar nenhum comportamento.

## What Changes

- Converte os 7 requisitos (R1–R7) e 5 cenários Given/When/Then de `docs/spec-manual/correcao-questoes/spec.md` para o formato OpenSpec (`### Requirement` / `#### Scenario`, WHEN/THEN), preservando o conteúdo e a cobertura de teste já existentes.
- Não altera nenhum código nem comportamento — a implementação já existe e já foi revisada (`docs/spec-manual/correcao-questoes/revisao-diff.md`).
- Não substitui `docs/spec-manual/correcao-questoes/`, que continua sendo o registro histórico do exercício de comparação de ferramentas (Etapa 5); a capability em `openspec/specs/` passa a ser a referência canônica para o comportamento do sistema.

## Capabilities

### New Capabilities
- `correcao-questoes`: calcular a nota de um aluno a partir de uma `Prova` (com gabarito) e suas respostas, tratando questões discursivas como pendentes de correção manual.

### Modified Capabilities
(nenhuma)

## Impact

- Nenhum código é alterado — apenas a especificação passa a existir também em `openspec/specs/correcao-questoes/spec.md`.
- Referência para futuras mudanças que dependam do comportamento de correção (ex.: a persistência do `ResultadoProva`, já especificada em `persistencia-resultado-correcao`).
