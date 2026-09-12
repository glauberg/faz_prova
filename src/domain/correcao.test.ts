import assert from "node:assert/strict";
import { test } from "node:test";
import { corrigirProva } from "./correcao.ts";
import type { Prova } from "./prova.ts";
import type { Questao } from "./questao.ts";
import type { RespostaAluno } from "./resposta.ts";

test("Cenário 1: todas as respostas corretas dão nota cheia", () => {
  const questoes: Questao[] = [
    { tipo: "multipla-escolha", enunciado: "Q1", alternativas: ["A", "B"], gabarito: ["A"] },
    { tipo: "dicotomica", enunciado: "Q2", gabarito: true },
  ];
  const prova: Prova = { titulo: "Prova", questoes };
  const respostas: RespostaAluno[] = [
    { questaoIndice: 0, valor: ["A"] },
    { questaoIndice: 1, valor: true },
  ];

  const resultado = corrigirProva(prova, respostas);

  assert.equal(resultado.acertosObjetivas, 2);
  assert.equal(resultado.totalObjetivas, 2);
});

test("Cenário 2: questão objetiva não respondida conta como errada", () => {
  const questoes: Questao[] = [
    { tipo: "resposta-unica", enunciado: "Q1", alternativas: ["40", "42"], gabarito: "42" },
  ];
  const prova: Prova = { titulo: "Prova", questoes };

  const resultado = corrigirProva(prova, []);

  assert.equal(resultado.acertosObjetivas, 0);
  assert.equal(resultado.totalObjetivas, 1);
  assert.equal(resultado.detalhamento[0]?.status, "errou");
});

test("Cenário 3 (caso de borda): prova só com discursivas retorna 0/0 sem erro", () => {
  const questoes: Questao[] = [
    { tipo: "discursiva", enunciado: "Explique X." },
    { tipo: "discursiva", enunciado: "Explique Y." },
  ];
  const prova: Prova = { titulo: "Prova", questoes };

  const resultado = corrigirProva(prova, []);

  assert.equal(resultado.acertosObjetivas, 0);
  assert.equal(resultado.totalObjetivas, 0);
  assert.ok(resultado.detalhamento.every((r) => r.status === "pendente"));
});

test("Cenário 4: resposta para questão inexistente é ignorada", () => {
  const questoes: Questao[] = [
    { tipo: "resposta-unica", enunciado: "Q1", alternativas: ["40", "42"], gabarito: "42" },
  ];
  const prova: Prova = { titulo: "Prova", questoes };
  const respostas: RespostaAluno[] = [
    { questaoIndice: 0, valor: "42" },
    { questaoIndice: 5, valor: "resposta perdida" },
  ];

  const resultado = corrigirProva(prova, respostas);

  assert.equal(resultado.acertosObjetivas, 1);
  assert.equal(resultado.totalObjetivas, 1);
});

test("Cenário 5: mistura de objetiva e discursiva separa a nota do pendente", () => {
  const questoes: Questao[] = [
    { tipo: "multipla-escolha", enunciado: "Q1", alternativas: ["A", "B"], gabarito: ["B"] },
    { tipo: "discursiva", enunciado: "Explique." },
  ];
  const prova: Prova = { titulo: "Prova", questoes };
  const respostas: RespostaAluno[] = [{ questaoIndice: 0, valor: ["B"] }];

  const resultado = corrigirProva(prova, respostas);

  assert.equal(resultado.acertosObjetivas, 1);
  assert.equal(resultado.totalObjetivas, 1);
  assert.equal(resultado.detalhamento[1]?.status, "pendente");
});

test("Cenário 6: múltipla escolha com mais de uma correta exige marcar exatamente o conjunto do gabarito", () => {
  const questoes: Questao[] = [
    {
      tipo: "multipla-escolha",
      enunciado: "Quais são números primos?",
      alternativas: ["2", "3", "4", "6"],
      gabarito: ["2", "3"],
    },
  ];
  const prova: Prova = { titulo: "Prova", questoes };

  const completo = corrigirProva(prova, [{ questaoIndice: 0, valor: ["3", "2"] }]);
  assert.equal(completo.detalhamento[0]?.status, "acertou");

  const parcial = corrigirProva(prova, [{ questaoIndice: 0, valor: ["2"] }]);
  assert.equal(parcial.detalhamento[0]?.status, "errou");

  const comExtra = corrigirProva(prova, [{ questaoIndice: 0, valor: ["2", "3", "4"] }]);
  assert.equal(comExtra.detalhamento[0]?.status, "errou");
});
