import assert from "node:assert/strict";
import { test } from "node:test";
import { validarQuestaoBanco } from "./questaoBanco.ts";

test("aceita questão de banco válida", () => {
  const erros = validarQuestaoBanco({
    tema: "Revolução Francesa",
    questao: { tipo: "discursiva", enunciado: "Explique a Revolução Francesa." },
  });
  assert.deepEqual(erros, []);
});

test("rejeita tema ausente", () => {
  const erros = validarQuestaoBanco({
    tema: "",
    questao: { tipo: "discursiva", enunciado: "Explique a Revolução Francesa." },
  });
  assert.ok(erros.includes("tema é obrigatório"));
});

test("rejeita tema em branco", () => {
  const erros = validarQuestaoBanco({
    tema: "   ",
    questao: { tipo: "discursiva", enunciado: "Explique a Revolução Francesa." },
  });
  assert.ok(erros.includes("tema é obrigatório"));
});

test("propaga erros de validação da questão", () => {
  const erros = validarQuestaoBanco({
    tema: "Matemática",
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quanto é 2+2?",
      alternativas: ["4"],
      gabarito: ["4"],
    },
  });
  assert.ok(erros.length > 0);
});
