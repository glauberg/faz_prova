import assert from "node:assert/strict";
import { test } from "node:test";
import { montarProva } from "./prova.ts";
import type { Questao } from "./questao.ts";

test("prova é montada com sucesso quando há título e questões válidas", () => {
  const questoes: Questao[] = [
    { tipo: "discursiva", enunciado: "Explique X." },
    {
      tipo: "resposta-unica",
      enunciado: "Qual o resultado de 2+2?",
      gabarito: "4",
    },
  ];

  const prova = montarProva({ titulo: "Prova de Matemática", questoes });

  assert.equal(prova.titulo, "Prova de Matemática");
  assert.deepEqual(prova.questoes, questoes);
});

test("prova sem nenhuma questão é rejeitada", () => {
  assert.throws(() => montarProva({ titulo: "Prova vazia", questoes: [] }));
});

test("prova com questão inválida é rejeitada", () => {
  const questoes: Questao[] = [{ tipo: "discursiva", enunciado: "" }];
  assert.throws(() => montarProva({ titulo: "Prova", questoes }));
});
