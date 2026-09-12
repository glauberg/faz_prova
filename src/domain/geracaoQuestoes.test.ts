import assert from "node:assert/strict";
import { test } from "node:test";
import { interpretarQuestaoGerada, montarPromptQuestao } from "./geracaoQuestoes.ts";

test("montarPromptQuestao inclui tema, referência e tipo pedido", () => {
  const prompt = montarPromptQuestao({
    tema: "Revolução Francesa",
    referenciaBibliografica: "HOBSBAWM, Eric. A Era das Revoluções.",
    tipo: "dicotomica",
  });

  assert.match(prompt, /Revolução Francesa/);
  assert.match(prompt, /HOBSBAWM, Eric\. A Era das Revoluções\./);
  assert.match(prompt, /"dicotomica"/);
});

test("interpretarQuestaoGerada aceita JSON de discursiva", () => {
  const questao = interpretarQuestaoGerada(
    "discursiva",
    '{"enunciado": "Explique a Revolução Francesa."}',
  );
  assert.deepEqual(questao, { tipo: "discursiva", enunciado: "Explique a Revolução Francesa." });
});

test("interpretarQuestaoGerada aceita JSON envolto em cerca de código markdown", () => {
  const questao = interpretarQuestaoGerada(
    "discursiva",
    '```json\n{"enunciado": "Explique a Revolução Francesa."}\n```',
  );
  assert.equal(questao.enunciado, "Explique a Revolução Francesa.");
});

test("interpretarQuestaoGerada aceita múltipla escolha com uma resposta correta", () => {
  const questao = interpretarQuestaoGerada(
    "multipla-escolha",
    JSON.stringify({
      enunciado: "Em que ano começou a Revolução Francesa?",
      alternativas: ["1789", "1799", "1804"],
      gabarito: ["1789"],
    }),
  );
  assert.deepEqual(questao, {
    tipo: "multipla-escolha",
    enunciado: "Em que ano começou a Revolução Francesa?",
    alternativas: ["1789", "1799", "1804"],
    gabarito: ["1789"],
  });
});

test("interpretarQuestaoGerada aceita múltipla escolha com mais de uma resposta correta", () => {
  const questao = interpretarQuestaoGerada(
    "multipla-escolha",
    JSON.stringify({
      enunciado: "Quais eram estados do Antigo Regime francês?",
      alternativas: ["Clero", "Nobreza", "Terceiro Estado", "Exército"],
      gabarito: ["Clero", "Nobreza", "Terceiro Estado"],
    }),
  );
  assert.deepEqual(questao.tipo === "multipla-escolha" && questao.gabarito, [
    "Clero",
    "Nobreza",
    "Terceiro Estado",
  ]);
});

test("interpretarQuestaoGerada aceita resposta única com alternativas", () => {
  const questao = interpretarQuestaoGerada(
    "resposta-unica",
    JSON.stringify({
      enunciado: "Quem liderou o Terror durante a Revolução Francesa?",
      alternativas: ["Robespierre", "Napoleão", "Luís XVI"],
      gabarito: "Robespierre",
    }),
  );
  assert.deepEqual(questao, {
    tipo: "resposta-unica",
    enunciado: "Quem liderou o Terror durante a Revolução Francesa?",
    alternativas: ["Robespierre", "Napoleão", "Luís XVI"],
    gabarito: "Robespierre",
  });
});

test("interpretarQuestaoGerada trata gabarito booleano vindo como string", () => {
  const verdadeiro = interpretarQuestaoGerada(
    "dicotomica",
    '{"enunciado": "A Bastilha caiu em 1789.", "gabarito": "true"}',
  );
  const falso = interpretarQuestaoGerada(
    "dicotomica",
    '{"enunciado": "A Bastilha caiu em 1789.", "gabarito": "false"}',
  );

  assert.equal(verdadeiro.tipo === "dicotomica" && verdadeiro.gabarito, true);
  assert.equal(falso.tipo === "dicotomica" && falso.gabarito, false);
});

test("interpretarQuestaoGerada rejeita JSON inválido", () => {
  assert.throws(() => interpretarQuestaoGerada("discursiva", "não é json"));
});

test("interpretarQuestaoGerada rejeita questão que falha na validação de domínio", () => {
  assert.throws(() =>
    interpretarQuestaoGerada(
      "multipla-escolha",
      JSON.stringify({ enunciado: "Sem alternativas suficientes", alternativas: ["única"] }),
    ),
  );
});
