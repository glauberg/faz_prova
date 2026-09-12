import assert from "node:assert/strict";
import { test } from "node:test";
import { PROVAS_DEMO, QUESTOES_BANCO_DEMO } from "./dadosDemonstracao.ts";
import { montarProva } from "./domain/prova.ts";
import { validarQuestaoBanco } from "./domain/questaoBanco.ts";

test("o banco de demonstração tem 25 questões", () => {
  assert.equal(QUESTOES_BANCO_DEMO.length, 25);
});

test("o banco de demonstração tem a distribuição de tipos pedida", () => {
  const contagem = { discursiva: 0, "multipla-escolha": 0, dicotomica: 0, "resposta-unica": 0 };
  for (const item of QUESTOES_BANCO_DEMO) {
    contagem[item.questao.tipo] += 1;
  }
  assert.equal(contagem["multipla-escolha"], 10);
  assert.equal(contagem.discursiva, 5);
  assert.equal(contagem.dicotomica, 5);
  assert.equal(contagem["resposta-unica"], 5);
});

test("cada questão do banco de demonstração é válida", () => {
  for (const item of QUESTOES_BANCO_DEMO) {
    assert.deepEqual(validarQuestaoBanco(item), []);
  }
});

test("cada prova de demonstração tem ao menos uma questão do seu tema no banco", () => {
  for (const provaDemo of PROVAS_DEMO) {
    const questoesDoTema = QUESTOES_BANCO_DEMO.filter((item) => item.tema === provaDemo.tema).map(
      (item) => item.questao,
    );
    assert.ok(questoesDoTema.length > 0, `nenhuma questão do tema "${provaDemo.tema}" no banco`);
    assert.doesNotThrow(() => montarProva({ titulo: provaDemo.titulo, questoes: questoesDoTema }));
  }
});
