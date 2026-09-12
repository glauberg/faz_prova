import assert from "node:assert/strict";
import { test } from "node:test";
import { criarCarrossel, TodosProvedoresFalharamError } from "./carrossel.ts";
import type { ProvedorIa } from "./tipos.ts";

function provedorFixo(nome: string, resultado: string): ProvedorIa {
  return { nome, completar: async () => resultado };
}

function provedorQueFalha(nome: string, mensagem: string): ProvedorIa {
  return {
    nome,
    completar: async () => {
      throw new Error(mensagem);
    },
  };
}

test("alterna o provedor inicial a cada chamada (round-robin)", async () => {
  const chamadas: string[] = [];
  const provedores: ProvedorIa[] = [
    {
      nome: "a",
      completar: async () => {
        chamadas.push("a");
        return "resposta-a";
      },
    },
    {
      nome: "b",
      completar: async () => {
        chamadas.push("b");
        return "resposta-b";
      },
    },
  ];
  const carrossel = criarCarrossel(provedores);

  await carrossel.completar("prompt 1");
  await carrossel.completar("prompt 2");
  await carrossel.completar("prompt 3");

  assert.deepEqual(chamadas, ["a", "b", "a"]);
});

test("recorre ao próximo provedor quando o primeiro falha", async () => {
  const provedores = [provedorQueFalha("a", "indisponível"), provedorFixo("b", "resposta-b")];
  const carrossel = criarCarrossel(provedores);

  const resultado = await carrossel.completar("prompt");

  assert.equal(resultado, "resposta-b");
});

test("lança TodosProvedoresFalharamError quando nenhum provedor responde", async () => {
  const provedores = [provedorQueFalha("a", "erro a"), provedorQueFalha("b", "erro b")];
  const carrossel = criarCarrossel(provedores);

  await assert.rejects(
    () => carrossel.completar("prompt"),
    (erro: unknown) => {
      assert.ok(erro instanceof TodosProvedoresFalharamError);
      assert.equal(erro.causas.length, 2);
      return true;
    },
  );
});

test("exige ao menos um provedor configurado", () => {
  assert.throws(() => criarCarrossel([]));
});
