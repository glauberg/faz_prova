## 1. Setup do projeto TypeScript

- [x] 1.1 Criar `package.json` com TypeScript e um test runner leve (ex.: `vitest` ou `node --test` com `ts-node`/`tsx`), sem dependências além do necessário para tipos e testes, e verificar que `npm install` conclui sem erros
- [x] 1.2 Criar `tsconfig.json` básico (strict mode ativado) e verificar que `npx tsc --noEmit` roda sem erros de configuração
- [x] 1.3 Configurar o script `npm test` para rodar os testes automatizados

## 2. Tipos de domínio

- [x] 2.1 Criar em `src/` os tipos `Questao` (com os 4 tipos: `discursiva`, `multipla-escolha`, `dicotomica`, `resposta-unica`) e `Prova`, e verificar que `npx tsc --noEmit` compila sem erros
- [x] 2.2 Adicionar teste automatizado verificando que os tipos aceitam os formatos válidos descritos na spec (compilação/uso básico)

## 3. Validação e montagem de questões

- [x] 3.1 Implementar validação de questão `discursiva` (exige apenas enunciado) e teste cobrindo o cenário "Questão discursiva válida"
- [x] 3.2 Implementar validação de questão `multipla-escolha` (enunciado, 2+ alternativas, gabarito correspondente a uma alternativa) e testes cobrindo os cenários "válida", "sem alternativas suficientes" e "gabarito inválido"
- [x] 3.3 Implementar validação de questão `dicotomica` (enunciado, gabarito entre dois valores) e testes cobrindo os cenários "válida" e "sem gabarito"
- [x] 3.4 Implementar validação de questão `resposta-unica` (enunciado, gabarito textual) e testes cobrindo os cenários "válida" e "sem gabarito"
- [x] 3.5 Implementar validação comum de enunciado ausente/vazio (aplicada aos 4 tipos) e teste cobrindo o cenário "Questão sem enunciado é rejeitada"

## 4. Montagem da prova

- [x] 4.1 Implementar a função de montagem que recebe título + lista de questões e retorna uma `Prova` válida quando todas as questões passam na validação, com teste cobrindo o cenário "Prova montada com sucesso"
- [x] 4.2 Implementar a rejeição de prova sem nenhuma questão, com teste cobrindo o cenário "Prova sem nenhuma questão é rejeitada"

## 5. Verificação final

- [x] 5.1 Rodar `npm test` e confirmar que todos os cenários da spec (`openspec/changes/criacao-questionario/specs/criacao-questionario/spec.md`) estão cobertos e passando
