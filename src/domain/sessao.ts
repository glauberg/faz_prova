import { createHmac, timingSafeEqual } from "node:crypto";

export interface SessaoPayload {
  professorId: string;
  expiraEm: number;
}

function assinar(dados: string, segredo: string): string {
  return createHmac("sha256", segredo).update(dados).digest("base64url");
}

export function assinarSessao(payload: SessaoPayload, segredo: string): string {
  const dados = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const assinatura = assinar(dados, segredo);
  return `${dados}.${assinatura}`;
}

export function verificarSessao(token: string, segredo: string): SessaoPayload | null {
  const [dados, assinatura] = token.split(".");
  if (!dados || !assinatura) {
    return null;
  }

  const assinaturaEsperada = assinar(dados, segredo);
  const bufferEsperado = Buffer.from(assinaturaEsperada);
  const bufferRecebido = Buffer.from(assinatura);
  if (
    bufferEsperado.length !== bufferRecebido.length ||
    !timingSafeEqual(bufferEsperado, bufferRecebido)
  ) {
    return null;
  }

  let payload: SessaoPayload;
  try {
    payload = JSON.parse(Buffer.from(dados, "base64url").toString());
  } catch {
    return null;
  }

  if (typeof payload.professorId !== "string" || typeof payload.expiraEm !== "number") {
    return null;
  }

  if (payload.expiraEm < Date.now()) {
    return null;
  }

  return payload;
}
