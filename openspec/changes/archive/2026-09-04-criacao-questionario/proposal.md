## Why

O projeto **Gestor de Provas** ainda não possui nenhuma funcionalidade de domínio implementada (apenas um script de exemplo). É necessário estabelecer a primeira capacidade real: permitir que um professor monte uma prova composta por questões, suportando os quatro tipos de questão previstos no escopo do produto (discursiva, múltipla escolha, dicotômica, resposta única). Esta capacidade é a base para funcionalidades futuras de correção (fora do escopo desta mudança).

## What Changes

- Adiciona o tipo `Prova`, composta por um título e uma lista de `Questao`.
- Adiciona o tipo `Questao` com suporte a 4 tipos: `discursiva`, `multipla-escolha`, `dicotomica`, `resposta-unica`.
- Adiciona uma função de criação/montagem que recebe os dados de uma prova e retorna uma `Prova` estruturada, validando que cada questão possui os campos obrigatórios do seu tipo (ex.: múltipla escolha exige alternativas e gabarito; dicotômica e resposta única exigem gabarito único; discursiva não exige gabarito).
- Rejeita (retorna erro/lança exceção) provas sem nenhuma questão e questões com campos obrigatórios ausentes para o seu tipo.
- Não inclui persistência, autenticação nem exportação (ex.: PDF) — a estrutura resultante existe apenas em memória.

## Capabilities

### New Capabilities
- `criacao-questionario`: montagem e validação de uma `Prova` com questões dos 4 tipos suportados.

### Modified Capabilities
(nenhuma — projeto ainda não possui capacidades existentes)

## Impact

- Novo código em `src/` (TypeScript): tipos de domínio (`Prova`, `Questao`) e a função de montagem/validação.
- Novos testes automatizados cobrindo os 4 tipos de questão e os casos de validação (prova vazia, questão sem gabarito/alternativas obrigatórias).
- Nenhum impacto em infraestrutura, banco de dados ou autenticação — está fora do escopo desta mudança.
