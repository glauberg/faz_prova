import { test } from "node:test";
import assert from "node:assert/strict";
import { validarQuestao, type Questao } from "./questao.ts";

test("questão discursiva com enunciado é válida", () => {
  const questao: Questao = { tipo: "discursiva", enunciado: "Explique X." };
  assert.deepEqual(validarQuestao(questao), []);
});

test("questão de múltipla escolha válida", () => {
  const questao: Questao = {
    tipo: "multipla-escolha",
    enunciado: "Qual a capital do Brasil?",
    alternativas: ["São Paulo", "Brasília", "Rio de Janeiro"],
    gabarito: "Brasília",
  };
  assert.deepEqual(validarQuestao(questao), []);
});

test("questão de múltipla escolha sem alternativas suficientes é rejeitada", () => {
  const questao: Questao = {
    tipo: "multipla-escolha",
    enunciado: "Pergunta",
    alternativas: ["única opção"],
    gabarito: "única opção",
  };
  assert.notEqual(validarQuestao(questao).length, 0);
});

test("questão de múltipla escolha com gabarito inválido é rejeitada", () => {
  const questao: Questao = {
    tipo: "multipla-escolha",
    enunciado: "Pergunta",
    alternativas: ["A", "B"],
    gabarito: "C",
  };
  assert.notEqual(validarQuestao(questao).length, 0);
});

test("questão dicotômica válida", () => {
  const questao: Questao = { tipo: "dicotomica", enunciado: "Afirmação", gabarito: true };
  assert.deepEqual(validarQuestao(questao), []);
});

test("questão dicotômica válida com gabarito falso (caso de borda: false é falsy)", () => {
  const questao: Questao = { tipo: "dicotomica", enunciado: "Afirmação", gabarito: false };
  assert.deepEqual(validarQuestao(questao), []);
});

test("questão dicotômica sem gabarito é rejeitada", () => {
  const questao = { tipo: "dicotomica", enunciado: "Afirmação" } as unknown as Questao;
  assert.notEqual(validarQuestao(questao).length, 0);
});

test("questão de resposta única válida", () => {
  const questao: Questao = {
    tipo: "resposta-unica",
    enunciado: "Qual o resultado de 2+2?",
    gabarito: "4",
  };
  assert.deepEqual(validarQuestao(questao), []);
});

test("questão de resposta única sem gabarito é rejeitada", () => {
  const questao = { tipo: "resposta-unica", enunciado: "Pergunta" } as unknown as Questao;
  assert.notEqual(validarQuestao(questao).length, 0);
});

test("questão sem enunciado é rejeitada, em qualquer tipo", () => {
  const questao: Questao = { tipo: "discursiva", enunciado: "" };
  assert.notEqual(validarQuestao(questao).length, 0);
});
