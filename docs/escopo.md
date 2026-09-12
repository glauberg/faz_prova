# Escopo da Atividade — Etapa 1

* **Projeto:** faz_prova
* **Branch:** `feature/sdd-commit-lint` (a partir de `main`)
* **Data:** 04/09/2026

## Contexto

A atividade pede a escolha de duas funcionalidades. Este documento registra como as duas funcionalidades foram usadas para propósitos distintos.

## Decisão de escopo

* **Funcionalidade A** — roda o fluxo principal (Etapas 2 a 4), utilizando OpenSpec/SpecKit.
* **Funcionalidade B** — roda o fluxo comparativo (Etapa 5), utilizando Markdown manual.

## Justificativa

* Atende à instrução de usar "ambos" (OpenSpec/SpecKit e Markdown manual) sem forçar as duas funcionalidades pelo mesmo processo.
* Evita o viés de comparar as ferramentas sobre a mesma spec, o que mediria "a ferramenta memorizou o output anterior" em vez de "a ferramenta lida bem com uma spec nova".
* Cada funcionalidade passa por um único fluxo, mantendo a comparação entre ferramentas (Etapa 5) justa: cada abordagem enfrenta uma especificação nunca vista antes por ela.

## Por que essas funcionalidades são boas candidatas a SDD

**Funcionalidade A (criação de questionário):** tem regras de negócio não triviais (cada um dos 4 tipos de questão exige um conjunto diferente de campos obrigatórios), tem casos de borda claros (prova sem questões, questão sem enunciado, gabarito de múltipla escolha que não corresponde a nenhuma alternativa) e mexe em mais de um arquivo (tipos, validação e montagem ficam em módulos separados). Escrever a spec antes do código obriga a decidir essas regras explicitamente, em vez de descobri-las incrementalmente durante a implementação.

**Funcionalidade B (correção de questões objetivas):** também tem regras de negócio (comparação de resposta do aluno com gabarito varia por tipo de questão) e um caso de borda relevante (questões discursivas não são corrigidas automaticamente, exigindo tratamento explícito na spec). Por depender de uma `Prova` já validada pela Funcionalidade A, é um bom caso para testar se uma especificação nova (nunca vista pela ferramenta) é suficiente para gerar uma implementação correta sem que o agente precise "adivinhar" o contrato de entrada.

## Consequências

* As Etapas 2–4 e a Etapa 5 não são diretamente comparáveis entre si (funcionalidades diferentes), mas a comparação pretendida — entre OpenSpec/SpecKit e Markdown manual — permanece válida, já que cada ferramenta parte de uma spec nova.
* Este documento serve como referência caso a divisão de escopo seja questionada durante a avaliação da atividade.
