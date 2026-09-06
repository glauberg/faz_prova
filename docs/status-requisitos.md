# Status dos Requisitos

* **Projeto:** faz_prova
* **Data:** 06/09/2026
* **Fontes:** `docs/etapa2-funcionalidades.md`, `openspec/specs/criacao-questionario/spec.md`, `docs/spec-manual/correcao-questoes/spec.md`

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

## Fora de escopo (decisão documentada, não é pendência)

Os itens abaixo foram deliberadamente excluídos do escopo da atividade em `docs/etapa2-funcionalidades.md` e no `CLAUDE.md` ("Não fazer") — não representam trabalho faltando, mas limites explícitos do que foi planejado:

- Persistência em banco de dados (da prova ou do resultado da correção)
- Autenticação
- Exportação para PDF
- Correção automática de questões discursivas
- Geração de feedback textual automático

## Verificação

- `npm test`: 18/18 testes passando, cobrindo todos os cenários de aceite de ambas as specs.
- `src/cli.ts` é um script de demonstração manual que integra as Funcionalidades A e B usando apenas funções já testadas; não introduz requisito novo.
