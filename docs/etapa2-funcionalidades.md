# Etapa 2 — Definição das Funcionalidades

* **Projeto:** faz_prova
* **Data:** 04/09/2026

Ambas as funcionalidades partem da descrição do projeto no `CLAUDE.md` (criação, correção e organização de avaliações com questões discursivas, múltipla escolha, dicotômicas e de resposta única).

## Funcionalidade A — Criação de questionário

**Fluxo:** Etapas 2–4, especificado via OpenSpec/SpecKit.

Permite ao professor montar uma prova composta por questões dos quatro tipos suportados (discursiva, múltipla escolha, dicotômica, resposta única).

* **Entrada:** dados da prova (título) e lista de questões, cada uma com enunciado, tipo e, quando aplicável, alternativas/gabarito.
* **Saída:** uma prova estruturada (`Prova` contendo `Questao[]`), pronta para ser armazenada ou exportada.
* **Fora de escopo nesta funcionalidade:** persistência em banco de dados, autenticação, exportação para PDF — a atividade trata apenas da criação/estruturação em memória.

## Funcionalidade B — Correção de questões objetivas

**Fluxo:** Etapa 5, especificado via Markdown manual (comparação com OpenSpec/SpecKit).

Recebe as respostas de um aluno para uma prova já montada (Funcionalidade A) e calcula a nota, comparando cada resposta objetiva (múltipla escolha, dicotômica, resposta única) com o gabarito da questão. Questões discursivas são identificadas mas não corrigidas automaticamente (exigem avaliação humana).

* **Entrada:** uma `Prova` (com gabarito) e as respostas de um aluno.
* **Saída:** nota/pontuação e, opcionalmente, o detalhamento de acertos e erros por questão.
* **Fora de escopo nesta funcionalidade:** correção de questões discursivas, feedback textual gerado automaticamente, persistência de resultados.

## Por que essas duas

* São funcionalidades **independentes o suficiente** para não exigir que uma dependa da implementação da outra durante a atividade (a Funcionalidade B pode ser especificada assumindo uma `Prova` já existente, sem depender do código real da Funcionalidade A).
* Cobrem partes distintas do domínio do projeto (criação vs. correção), o que é coerente com "Preferir funções pequenas, com uma única responsabilidade" do `CLAUDE.md`.
* Nenhuma delas exige banco de dados, autenticação ou arquitetura complexa, respeitando as restrições da seção "Não fazer" do `CLAUDE.md`.

Ver também `docs/escopo.md` para a justificativa de usar fluxos (ferramentas) diferentes para cada funcionalidade.
