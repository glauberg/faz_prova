import assert from "node:assert/strict";
import { test } from "node:test";
import { PROVAS_DEMO } from "./dadosDemonstracao.ts";
import { montarProva } from "./domain/prova.ts";

test("cada prova de demonstração é válida segundo montarProva", () => {
  for (const provaDemo of PROVAS_DEMO) {
    assert.doesNotThrow(() =>
      montarProva({ titulo: provaDemo.titulo, questoes: provaDemo.questoes }),
    );
  }
});

test("respostas de demonstração referenciam apenas questões existentes na respectiva prova", () => {
  for (const provaDemo of PROVAS_DEMO) {
    for (const aluno of provaDemo.alunos) {
      for (const resposta of aluno.respostas) {
        assert.ok(
          resposta.questaoIndice >= 0 && resposta.questaoIndice < provaDemo.questoes.length,
          `resposta de ${aluno.alunoId} referencia questão inexistente na prova "${provaDemo.titulo}"`,
        );
      }
    }
  }
});
