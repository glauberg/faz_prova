import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const TAMANHO_SALT = 16;
const TAMANHO_CHAVE = 64;

export function criarHashSenha(senha: string): string {
  const salt = randomBytes(TAMANHO_SALT).toString("hex");
  const chave = scryptSync(senha, salt, TAMANHO_CHAVE).toString("hex");
  return `${salt}:${chave}`;
}

export function verificarSenha(senha: string, hashArmazenado: string): boolean {
  const [salt, chaveEsperadaHex] = hashArmazenado.split(":");
  if (!salt || !chaveEsperadaHex) {
    return false;
  }

  const chaveEsperada = Buffer.from(chaveEsperadaHex, "hex");
  const chaveObtida = scryptSync(senha, salt, chaveEsperada.length);

  return chaveEsperada.length === chaveObtida.length && timingSafeEqual(chaveEsperada, chaveObtida);
}
