## Purpose

Recebe as respostas de um aluno para uma `Prova` já montada (Funcionalidade A) e calcula a nota das questões objetivas, sem exigir correção manual para múltipla escolha, dicotômica e resposta única. Questões discursivas nunca são corrigidas automaticamente.

## ADDED Requirements

### Requirement: Correção de questões objetivas
O sistema SHALL calcular, dada uma `Prova` com gabarito e as respostas de um aluno, quantos acertos o aluno obteve entre as questões objetivas (`multipla-escolha`, `dicotomica`, `resposta-unica`), retornando a nota objetiva (acertos/total) e um detalhamento por questão (acertou, errou ou pendente).

#### Scenario: Todas as respostas corretas
- **WHEN** uma prova com 2 questões objetivas é corrigida com respostas do aluno corretas para ambas
- **THEN** o resultado indica 2 acertos em 2 questões objetivas (nota 100%)

#### Scenario: Questão não respondida conta como errada
- **WHEN** uma questão objetiva da prova não tem resposta do aluno
- **THEN** essa questão é contabilizada como errada no detalhamento

### Requirement: Questões discursivas nunca são corrigidas automaticamente
O sistema SHALL marcar toda questão do tipo `discursiva` como "pendente de correção manual" no detalhamento, sem nunca contá-la como acerto ou erro nem incluí-la no denominador da nota objetiva.

#### Scenario: Mistura de tipos objetivos e discursiva
- **WHEN** uma prova com 1 questão de múltipla escolha (respondida corretamente) e 1 questão discursiva é corrigida
- **THEN** o resultado indica 1 acerto de 1 questão objetiva, e a questão discursiva aparece separadamente como pendente, sem entrar no denominador da nota objetiva

### Requirement: Prova sem questões objetivas
O sistema SHALL retornar nota 0 acertos de 0 questões objetivas, sem lançar erro, quando a prova não tiver nenhuma questão objetiva (só discursivas).

#### Scenario: Prova só com questões discursivas
- **WHEN** uma prova cujas questões são todas do tipo `discursiva` é corrigida
- **THEN** o resultado indica 0 acertos de 0 questões objetivas, sem lançar erro, e todas as questões aparecem como "pendente de correção manual"

### Requirement: Resposta para questão inexistente é ignorada
O sistema SHALL ignorar, sem lançar erro nem afetar a nota, uma resposta do aluno que referencie uma questão que não existe na prova sendo corrigida.

#### Scenario: Resposta para questão inexistente
- **WHEN** uma resposta do aluno referencia uma questão que não está na prova
- **THEN** essa resposta é ignorada e não altera o resultado da correção
