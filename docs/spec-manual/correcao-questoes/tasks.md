# Plano de tarefas — Correção de questões objetivas

## Plano gerado (pedido ao agente a partir da spec acima)

## 1. Tipos de domínio

- [ ] 1.1 Criar tipo `RespostaAluno` (referência à questão + valor respondido) em `src/`
- [ ] 1.2 Criar tipo `ResultadoQuestao` (acertou / errou / pendente) e `ResultadoProva` (nota objetiva + detalhamento por questão)
- [ ] 1.3 Verificar que `npx tsc --noEmit` compila sem erros

## 2. Correção de questões objetivas

- [ ] 2.1 Implementar comparação de resposta x gabarito para múltipla escolha
- [ ] 2.2 Implementar comparação de resposta x gabarito para dicotômica
- [ ] 2.3 Implementar comparação de resposta x gabarito para resposta única
- [ ] 2.4 Implementar tratamento de questão discursiva como pendente
- [ ] 2.5 Implementar tratamento de questão objetiva sem resposta como erro
- [ ] 2.6 Implementar ignorar resposta para questão inexistente na prova

## 3. Função de correção da prova

- [ ] 3.1 Implementar `corrigirProva(prova, respostas)` combinando as regras acima e calculando a nota objetiva
- [ ] 3.2 Tratar prova sem questões objetivas retornando nota 0/0 sem erro

## 4. Testes

- [ ] 4.1 Teste do Cenário 1 (todas corretas)
- [ ] 4.2 Teste do Cenário 2 (não respondida = errada)
- [ ] 4.3 Teste do Cenário 3 (só discursivas, caso de borda)
- [ ] 4.4 Teste do Cenário 4 (resposta para questão inexistente)
- [ ] 4.5 Teste do Cenário 5 (mistura objetiva + discursiva)

## 5. Verificação final

- [ ] 5.1 Rodar `npm test` e confirmar que todos os cenários da spec estão cobertos e passando

---

## Revisão do plano (com justificativa)

Revisando o plano acima antes de executar:

- **Mesclar 1.1 e 1.2 em uma única tarefa.** Os tipos `RespostaAluno`, `ResultadoQuestao` e `ResultadoProva` são pequenos e interdependentes (o resultado referencia os outros dois) — separá-los em duas tarefas cria uma pausa artificial no meio de um único arquivo. Vou implementá-los juntos.
- **Remover as tarefas 2.1–2.3 como tarefas separadas.** Comparar resposta x gabarito por tipo de questão é essencialmente um `switch` sobre o mesmo padrão já usado em `validarQuestao` (`src/questao.ts`). Tratar como 3 tarefas independentes exageraria a granularidade — vou implementar como uma função única `respostaEstaCorreta(questao, resposta)` com um `switch` interno, testada pelos cenários da seção 4 (que já cobrem os 3 tipos indiretamente através do Cenário 1 e 5). Mantenho apenas uma tarefa consolidada.
- **Manter 2.4, 2.5, 2.6 e a seção 3 como estão** — cada uma corresponde a uma regra de negócio distinta (R3, R5, R6) que merece verificação isolada.
- **Não reordenar**: a ordem de dependência (tipos → regra de comparação → função de correção → testes → verificação final) já é a ordem lógica correta, igual ao que foi feito na Funcionalidade A.

Plano revisado a ser executado: tipos consolidados (1), regra de correção consolidada + regras de negócio (2), função de correção (3), testes por cenário (4), verificação final (5) — 9 tarefas em vez de 13.

## Plano revisado (executado)

## 1. Tipos de domínio

- [x] 1.1 Criar `RespostaAluno`, `ResultadoQuestao` e `ResultadoProva` em `src/` e verificar que `npx tsc --noEmit` compila sem erros

## 2. Regras de correção

- [x] 2.1 Implementar `respostaEstaCorreta(questao, resposta)` cobrindo múltipla escolha, dicotômica e resposta única
- [x] 2.2 Tratar questão discursiva como pendente (nunca conta como erro/acerto)
- [x] 2.3 Tratar questão objetiva sem resposta do aluno como errada
- [x] 2.4 Ignorar resposta do aluno para questão que não existe na prova

## 3. Função de correção da prova

- [x] 3.1 Implementar `corrigirProva(prova, respostas)` combinando as regras acima
- [x] 3.2 Tratar prova sem questões objetivas retornando nota 0/0 sem erro

## 4. Testes

- [x] 4.1 Testes dos 5 cenários de aceite da spec

## 5. Verificação final

- [x] 5.1 Rodar `npm test` e confirmar que todos os cenários estão cobertos e passando
