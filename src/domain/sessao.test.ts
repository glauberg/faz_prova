import assert from "node:assert/strict";
import { test } from "node:test";
import { assinarSessao, verificarSessao } from "./sessao.ts";

const SEGREDO = "segredo-de-teste";

test("verificarSessao aceita um token válido e não expirado", () => {
  const token = assinarSessao({ professorId: "p1", expiraEm: Date.now() + 60_000 }, SEGREDO);
  const payload = verificarSessao(token, SEGREDO);
  assert.deepEqual(payload, { professorId: "p1", expiraEm: payload?.expiraEm });
});

test("verificarSessao rejeita token expirado", () => {
  const token = assinarSessao({ professorId: "p1", expiraEm: Date.now() - 1 }, SEGREDO);
  assert.equal(verificarSessao(token, SEGREDO), null);
});

test("verificarSessao rejeita token assinado com outro segredo", () => {
  const token = assinarSessao({ professorId: "p1", expiraEm: Date.now() + 60_000 }, SEGREDO);
  assert.equal(verificarSessao(token, "outro-segredo"), null);
});

test("verificarSessao rejeita token adulterado", () => {
  const token = assinarSessao({ professorId: "p1", expiraEm: Date.now() + 60_000 }, SEGREDO);
  const [dados] = token.split(".");
  const payloadAdulterado = Buffer.from(
    JSON.stringify({ professorId: "outro-professor", expiraEm: Date.now() + 60_000 }),
  ).toString("base64url");
  const tokenAdulterado = `${payloadAdulterado}.${token.split(".")[1]}`;
  assert.notEqual(dados, payloadAdulterado);
  assert.equal(verificarSessao(tokenAdulterado, SEGREDO), null);
});

test("verificarSessao rejeita token malformado", () => {
  assert.equal(verificarSessao("token-sem-ponto", SEGREDO), null);
});
