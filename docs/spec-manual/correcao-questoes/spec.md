# Spec — Correção de questões objetivas

## Requisitos (PRD)

- **R1:** Dada uma `Prova` (com gabarito) e as respostas de um aluno, o sistema deve calcular quantas questões objetivas o aluno acertou.
- **R2:** São objetivas as questões dos tipos `multipla-escolha`, `dicotomica` e `resposta-unica`.
- **R3:** Questões `discursiva` nunca são corrigidas automaticamente — devem aparecer no resultado como "pendente de correção manual".
- **R4:** O resultado deve conter a nota das questões objetivas (acertos / total de objetivas) e um detalhamento por questão (acertou, errou ou pendente).
- **R5:** Se o aluno não respondeu uma questão objetiva, ela conta como errada.
- **R6:** Uma resposta do aluno para uma questão que não existe na prova é ignorada — não deve quebrar a correção nem afetar a nota.
- **R7:** Uma prova sem nenhuma questão objetiva (só discursivas) deve retornar nota 0 acertos de 0 objetivas, sem lançar erro.

## Critérios de aceite (Given/When/Then)

### Cenário 1 — Todas as respostas corretas
- **Given** uma prova com 2 questões objetivas e respostas do aluno corretas para ambas
- **When** o sistema corrige a prova
- **Then** o resultado indica 2 acertos em 2 questões objetivas (nota 100%)

### Cenário 2 — Questão não respondida conta como errada
- **Given** uma questão objetiva sem resposta do aluno
- **When** o sistema corrige a prova
- **Then** essa questão é contabilizada como errada no detalhamento

### Cenário 3 (caso de borda) — Prova só com questões discursivas
- **Given** uma prova cujas questões são todas do tipo `discursiva`
- **When** o sistema corrige a prova
- **Then** o resultado indica 0 acertos de 0 questões objetivas, sem lançar erro, e todas as questões aparecem como "pendente de correção manual"

### Cenário 4 — Resposta para questão inexistente é ignorada
- **Given** uma resposta do aluno que referencia uma questão que não está na prova
- **When** o sistema corrige a prova
- **Then** essa resposta é ignorada e não altera o resultado da correção

### Cenário 5 — Mistura de tipos objetivos e discursiva
- **Given** uma prova com 1 questão de múltipla escolha (respondida corretamente) e 1 questão discursiva
- **When** o sistema corrige a prova
- **Then** o resultado indica 1 acerto de 1 questão objetiva, e a questão discursiva aparece separadamente como pendente (não entra no denominador da nota objetiva)
