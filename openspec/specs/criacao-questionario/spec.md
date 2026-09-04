# criacao-questionario Specification

## Purpose
Permite que um professor monte uma prova (`Prova`) composta por questões (`Questao`) dos quatro tipos suportados pelo produto, validando que cada questão tenha os campos exigidos pelo seu tipo antes de considerar a prova válida.

## Requirements

### Requirement: Montagem de prova com questões
O sistema SHALL permitir montar uma `Prova` a partir de um título e uma lista de `Questao`, retornando a `Prova` estruturada quando todas as questões forem válidas.

#### Scenario: Prova montada com sucesso
- **WHEN** os dados de entrada contêm um título e ao menos uma questão válida
- **THEN** o sistema retorna uma `Prova` contendo o título e a lista de questões, na mesma ordem em que foram informadas

#### Scenario: Prova sem nenhuma questão é rejeitada
- **WHEN** os dados de entrada contêm um título mas nenhuma questão
- **THEN** o sistema rejeita a montagem, sem retornar uma `Prova`

### Requirement: Questão do tipo discursiva
O sistema SHALL aceitar uma questão do tipo `discursiva` contendo apenas um enunciado, sem exigir gabarito ou alternativas.

#### Scenario: Questão discursiva válida
- **WHEN** uma questão do tipo `discursiva` é informada com um enunciado não vazio
- **THEN** o sistema aceita a questão como válida, mesmo sem gabarito ou alternativas

### Requirement: Questão do tipo múltipla escolha
O sistema SHALL exigir, para uma questão do tipo `multipla-escolha`, um enunciado, uma lista de ao menos duas alternativas e um gabarito que aponte para uma das alternativas informadas.

#### Scenario: Questão de múltipla escolha válida
- **WHEN** uma questão do tipo `multipla-escolha` é informada com enunciado, duas ou mais alternativas e um gabarito que corresponde a uma das alternativas
- **THEN** o sistema aceita a questão como válida

#### Scenario: Questão de múltipla escolha sem alternativas é rejeitada
- **WHEN** uma questão do tipo `multipla-escolha` é informada sem alternativas ou com apenas uma alternativa
- **THEN** o sistema rejeita a questão

#### Scenario: Questão de múltipla escolha com gabarito inválido é rejeitada
- **WHEN** uma questão do tipo `multipla-escolha` é informada com um gabarito que não corresponde a nenhuma das alternativas informadas
- **THEN** o sistema rejeita a questão

### Requirement: Questão do tipo dicotômica
O sistema SHALL exigir, para uma questão do tipo `dicotomica`, um enunciado e um gabarito com um entre dois valores possíveis (por exemplo, verdadeiro/falso).

#### Scenario: Questão dicotômica válida
- **WHEN** uma questão do tipo `dicotomica` é informada com enunciado e um gabarito dentre os dois valores possíveis
- **THEN** o sistema aceita a questão como válida

#### Scenario: Questão dicotômica sem gabarito é rejeitada
- **WHEN** uma questão do tipo `dicotomica` é informada sem gabarito
- **THEN** o sistema rejeita a questão

### Requirement: Questão do tipo resposta única
O sistema SHALL exigir, para uma questão do tipo `resposta-unica`, um enunciado e um gabarito textual único.

#### Scenario: Questão de resposta única válida
- **WHEN** uma questão do tipo `resposta-unica` é informada com enunciado e um gabarito não vazio
- **THEN** o sistema aceita a questão como válida

#### Scenario: Questão de resposta única sem gabarito é rejeitada
- **WHEN** uma questão do tipo `resposta-unica` é informada sem gabarito
- **THEN** o sistema rejeita a questão

### Requirement: Rejeição de questão com enunciado ausente
O sistema SHALL rejeitar qualquer questão, independentemente do tipo, cujo enunciado esteja ausente ou vazio.

#### Scenario: Questão sem enunciado é rejeitada
- **WHEN** uma questão de qualquer tipo é informada com enunciado ausente ou vazio
- **THEN** o sistema rejeita a questão
