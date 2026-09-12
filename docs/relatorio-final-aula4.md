# Relatório Final — Prática Assíncrona Aula 4 (SDD)
**Projeto:** faz_prova | **Branch:** feature/sdd-commit-lint | **Data:** 04/09/2026

## 1. Funcionalidades escolhidas e por que eram bom caso para SDD

**Funcionalidade A — Criação de questionário**: montar uma `Prova` com questões dos 4 tipos suportados pelo produto (discursiva, múltipla escolha, dicotômica, resposta única). É boa candidata a SDD porque cada tipo de questão tem regras de campos obrigatórios diferentes (ex.: múltipla escolha exige alternativas e gabarito correspondente; discursiva não exige gabarito) e tem casos de borda claros (prova vazia, questão sem enunciado, gabarito inválido).

**Funcionalidade B — Correção de questões objetivas**: calcular a nota de um aluno a partir de uma `Prova` (com gabarito) e suas respostas. Boa candidata a SDD porque depende do contrato gerado pela Funcionalidade A (testando se uma spec nova é suficiente sem "adivinhar" esse contrato) e tem regras de negócio próprias: questões discursivas nunca são corrigidas automaticamente, resposta ausente conta como erro, resposta para questão inexistente é ignorada.

## 2. Abordagens de especificação usadas

**Funcionalidade A — OpenSpec** (`@fission-ai/openspec`, via `npx`, sem instalação permanente). Gerou `proposal.md`, `specs/<capability>/spec.md` (formato rígido `### Requirement` / `#### Scenario` em WHEN/THEN) e `tasks.md`, com rastreamento de estado via `openspec status` e validação via `openspec validate`. Na prática, forçou uma decomposição por requisito atômico (um por tipo de questão) e pegou automaticamente erros de formatação de cenário — mas seu schema não cobre 1:1 o que o roteiro da disciplina pedia (user story pura, critérios Given/When/Then, revisão justificada do plano), exigindo um documento complementar manual para esses itens.

**Funcionalidade B — Markdown manual**, sem ferramenta. Escrevi `proposal.md`/`spec.md`/`tasks.md` livremente, organizados por cenário de uso (5 Given/When/Then, incluindo o caso de borda de prova só com questões discursivas). Sem setup e mais flexível para seguir exatamente o formato pedido pelo roteiro, mas sem nenhuma verificação automática de completude — a coerência entre requisito, cenário e teste dependeu inteiramente de revisão manual.

Comparação detalhada (artefatos, prós/contras, código gerado) em `docs/etapa5-comparacao.md`.

## 3. Uma dificuldade real enfrentada

**Técnica:** rodar testes TypeScript sem adicionar dependências desnecessárias (proibido pelo `CLAUDE.md`). A solução óbvia seria `vitest` ou `ts-node`, mas o Node 24 já roda `.ts` nativamente via `node --test` com type-stripping — descobri, ao testar, que isso só funciona se os imports relativos usarem extensão `.ts` explícita (`./questao.ts`, não `./questao.js`), o que por sua vez exige `"allowImportingTsExtensions": true` + `"noEmit": true` no `tsconfig.json` para o `tsc` não reclamar. Sem essa investigação, o caminho "padrão" (imports com `.js`, como o `tsc --module NodeNext` normalmente exige) simplesmente não executa no `node --test`.

**Conceitual:** o roteiro da disciplina fala em "a funcionalidade escolhida" no singular depois de pedir duas funcionalidades no plural — resolvido documentando essa ambiguidade em `docs/escopo.md` e usando as duas funcionalidades para propósitos distintos (fluxo principal vs. fluxo comparativo da Etapa 5), em vez de forçar as duas pelo mesmo processo, o que teria viesado a comparação entre ferramentas.
