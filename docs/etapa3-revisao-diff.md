# Etapa 3 — Revisão de diff antes de aceitar

## Diff revisado

Commit `b3a71cc` — `feat: implementa criação de questionário (Etapa 4)`, especificamente `src/questao.ts`.

## O que eu teria deixado passar sem a revisão

Na função `validarQuestao`, a validação da questão `dicotomica` verifica o gabarito assim:

```ts
case "dicotomica":
  if (typeof questao.gabarito !== "boolean") {
    erros.push("gabarito é obrigatório");
  }
  break;
```

Uma primeira versão "óbvia" dessa checagem — a que eu teria aceitado sem revisar com atenção — seria a forma mais curta e comum em TypeScript/JavaScript:

```ts
if (!questao.gabarito) {
  erros.push("gabarito é obrigatório");
}
```

Essa versão parece equivalente, mas tem um bug: quando o gabarito da questão dicotômica é `false` (uma resposta legítima do tipo verdadeiro/falso), `!questao.gabarito` avalia para `true` porque `false` é falsy em JavaScript — e o sistema rejeitaria incorretamente uma questão válida só porque a resposta correta é "falso". Isso é exatamente o tipo de caso de borda que o cenário "Questão dicotômica válida" da spec deveria cobrir, mas um teste apressado (testando só com `gabarito: true`) não pegaria o problema.

Ao revisar o diff antes de aceitar, percebi que a validação usa `typeof questao.gabarito !== "boolean"` — que distingue corretamente "gabarito ausente" (`undefined`) de "gabarito é `false`" — e completei o teste em `src/questao.test.ts` com um caso explícito de gabarito `false` sendo aceito, para não depender apenas da leitura do código.

## Conclusão

A revisão do diff confirmou que a implementação já usava a forma correta (`typeof`), mas o exercício de revisão expôs uma armadilha real que teria passado despercebida em uma implementação mais apressada (ou em uma revisão superficial que só olhasse "a validação existe", sem considerar o valor `false` como entrada válida).
