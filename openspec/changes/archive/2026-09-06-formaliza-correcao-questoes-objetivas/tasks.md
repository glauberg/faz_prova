## 1. Conversão da spec manual para OpenSpec

- [x] 1.1 Converter os 7 requisitos (R1–R7) de `docs/spec-manual/correcao-questoes/spec.md` para `### Requirement` no formato OpenSpec
- [x] 1.2 Converter os 5 cenários Given/When/Then para `#### Scenario` no formato WHEN/THEN

## 2. Verificação de que a implementação já cobre a spec

- [x] 2.1 Confirmar que `src/domain/resposta.ts` e `src/domain/correcao.ts` já implementam todos os requisitos (nenhum código foi alterado por esta change)
- [x] 2.2 Confirmar que `src/domain/correcao.test.ts` cobre os 5 cenários da spec — `npm test` (18/18, incluindo os 5 cenários de correção)
