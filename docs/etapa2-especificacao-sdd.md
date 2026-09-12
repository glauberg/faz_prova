# Etapa 2 — Especificação com SDD (Funcionalidade A)

## Prompt inicial (user story, sem decisão técnica)

> Como professor, quero montar uma prova com várias questões de tipos diferentes (discursiva, múltipla escolha, verdadeiro/falso, resposta única), para que eu possa aplicar uma avaliação estruturada aos meus alunos. Cada questão deve ter um enunciado; questões objetivas (múltipla escolha, verdadeiro/falso, resposta única) precisam de um gabarito para permitir correção automática depois. Não quero conseguir montar uma prova vazia, nem uma prova com uma questão mal formada (por exemplo, sem enunciado, ou de múltipla escolha sem alternativas suficientes).

*(Nota: o prompt efetivamente enviado ao `/opsx:propose` incluiu uma decisão técnica — "apenas estruturação em memória/TypeScript" — que não deveria estar no prompt inicial. Essa decisão pertence à fase de design/implementação, não ao comportamento. Registro isso aqui como o prompt correto, no formato exigido pelo roteiro.)*

## Requisitos (PRD)

- **R1:** O professor deve poder montar uma prova a partir de um título e uma lista de questões.
- **R2:** A prova deve suportar 4 tipos de questão: discursiva, múltipla escolha, dicotômica (verdadeiro/falso), resposta única.
- **R3:** Questões de múltipla escolha devem ter ao menos duas alternativas e um gabarito que corresponda a uma delas.
- **R4:** Questões dicotômicas devem ter um gabarito entre dois valores possíveis.
- **R5:** Questões de resposta única devem ter um gabarito textual.
- **R6:** Questões discursivas não exigem gabarito nem alternativas.
- **R7:** Uma prova sem nenhuma questão deve ser rejeitada.
- **R8:** Uma questão sem enunciado deve ser rejeitada, independentemente do tipo.

## Critérios de aceite (Given/When/Then)

1. **Given** um título e ao menos uma questão válida, **When** o professor monta a prova, **Then** o sistema retorna a prova estruturada contendo o título e as questões na mesma ordem em que foram informadas.
2. **Given** uma questão de múltipla escolha cujo gabarito não corresponde a nenhuma das alternativas informadas, **When** o professor tenta montar a prova, **Then** o sistema rejeita a questão.
3. **Given** um título mas nenhuma questão, **When** o professor tenta montar a prova, **Then** o sistema rejeita a montagem.
4. **Given** uma questão de múltipla escolha com apenas uma alternativa (caso de borda), **When** o professor tenta montar a prova, **Then** o sistema rejeita a questão por não haver alternativas suficientes.

## Ferramenta usada

OpenSpec (`@fission-ai/openspec`, via `npx`), gerando `proposal.md`, `specs/criacao-questionario/spec.md` e `tasks.md` em `openspec/changes/criacao-questionario/`. Ver `docs/escopo.md` para a justificativa de por que essa abordagem foi usada na Funcionalidade A (e Markdown manual está reservado para a Funcionalidade B, na Etapa 5).

## Revisão do plano de tarefas gerado (tasks.md)

O plano gerado pelo `/opsx:propose` (5 grupos, 13 tarefas) foi executado como está, mas ao revisá-lo agora percebo uma redundância que deveria ter sido corrigida antes da execução:

- **Tarefa 2.2** ("Adicionar teste automatizado verificando que os tipos aceitam os formatos válidos descritos na spec") ficou redundante em relação às tarefas 3.1–3.4, que já testam a validade de cada tipo de questão individualmente. Na prática, o teste de 2.2 não foi implementado como um teste separado — sua cobertura foi absorvida pelos testes de 3.1–3.4.
- **Decisão:** mantenho o registro dessa redundância aqui em vez de reescrever o histórico do `tasks.md` já executado. Para uma próxima mudança, a tarefa 2.2 deveria ser removida do plano (ou reformulada para cobrir algo que 3.1–3.4 não cobrem, como checagem de compilação dos tipos isoladamente).
- As demais tarefas foram mantidas na ordem proposta: a ordem de dependência (setup → tipos → validação por tipo → montagem → verificação final) fazia sentido e não havia motivo para reordenar.
