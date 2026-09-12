import assert from "node:assert/strict";
import { test } from "node:test";
import { criarHashSenha, verificarSenha } from "./senha.ts";

test("verificarSenha aceita a senha correta", () => {
  const hash = criarHashSenha("prof123");
  assert.equal(verificarSenha("prof123", hash), true);
});

test("verificarSenha rejeita senha incorreta", () => {
  const hash = criarHashSenha("prof123");
  assert.equal(verificarSenha("outra-senha", hash), false);
});

test("criarHashSenha gera hashes diferentes para a mesma senha (salt aleatório)", () => {
  const hash1 = criarHashSenha("prof123");
  const hash2 = criarHashSenha("prof123");
  assert.notEqual(hash1, hash2);
  assert.equal(verificarSenha("prof123", hash1), true);
  assert.equal(verificarSenha("prof123", hash2), true);
});

test("verificarSenha rejeita hash em formato inválido", () => {
  assert.equal(verificarSenha("prof123", "hash-sem-separador"), false);
});
