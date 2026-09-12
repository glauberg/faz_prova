# Proposta — Correção de questões objetivas

## Prompt inicial (user story, sem decisão técnica)

> Como professor, quero que o sistema calcule automaticamente a nota de um aluno a partir das respostas dele e do gabarito da prova, para que eu não precise corrigir manualmente as questões objetivas (múltipla escolha, verdadeiro/falso, resposta única). Questões discursivas continuam exigindo correção manual — o sistema só deve indicar quais ficaram pendentes.

## Por quê

A Funcionalidade A (criação de questionário, `openspec/specs/criacao-questionario/spec.md`) já permite montar uma `Prova` válida com gabarito. Falta a segunda metade do fluxo: dado que um aluno respondeu a prova, calcular a nota sem exigir correção manual das questões objetivas.

## O que muda

- Adiciona um tipo para representar as respostas de um aluno a uma prova.
- Adiciona uma função de correção que recebe uma `Prova` (com gabarito) e as respostas do aluno, e retorna a nota das questões objetivas mais um detalhamento por questão.
- Trata questões discursivas como "pendente de correção manual" (nunca contam como erro nem acerto automático).
- Trata respostas ausentes como erro, e respostas para questões inexistentes como ignoradas.

## Fora de escopo

- Correção de questões discursivas.
- Geração de feedback textual.
- Persistência do resultado da correção.

## Impacto

- Novo código em `src/`: tipo de resposta do aluno e função de correção.
- Depende dos tipos `Prova`/`Questao` já existentes em `src/prova.ts` e `src/questao.ts` (Funcionalidade A).
- Novos testes automatizados cobrindo os cenários de aceite abaixo.
