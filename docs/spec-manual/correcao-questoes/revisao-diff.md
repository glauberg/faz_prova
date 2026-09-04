# Revisão de diff — Correção de questões objetivas

## O que eu teria deixado passar sem a revisão

Em `respostaEstaCorreta` (`src/correcao.ts`), a comparação para questão de tipo `resposta-unica` usa:

```ts
case "resposta-unica":
  return typeof valor === "string" && valor.trim() === questao.gabarito.trim();
```

A versão mais direta — e a que eu teria aceitado numa primeira leitura, por parecer suficiente — seria:

```ts
case "resposta-unica":
  return valor === questao.gabarito;
```

Essa versão mais simples tem um problema real: a resposta de um aluno, vinda de um formulário de texto livre, frequentemente tem espaços extras no início/fim (ex.: `"42 "` em vez de `"42"`). Com `===` puro, uma resposta correta seria marcada como errada só por causa de um espaço a mais. Nenhum dos 5 cenários da spec cobre esse caso explicitamente — ele não estava na lista de Given/When/Then, então uma implementação apressada teria passado nos testes da spec sem tratar isso.

Ao revisar o diff, decidi manter o `.trim()` em ambos os lados (resposta e gabarito) mesmo sem um cenário formal cobrindo isso, porque é uma consequência direta de R1 ("dada uma Prova... e as respostas de um aluno") — respostas de aluno em texto livre são a entrada mais realista.

## Conclusão

Diferente da revisão da Funcionalidade A (onde o problema já estava evitado no código gerado), aqui a revisão me levou a **adicionar** um tratamento (trim) que não estava explicitamente exigido pela spec, mas que decorre logicamente do domínio do problema. Isso é registrado aqui, e não na spec, porque não altera nenhum requisito ou cenário formal — é um detalhe de robustez de implementação.
