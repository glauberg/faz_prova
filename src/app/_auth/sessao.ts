import { cookies } from "next/headers";
import { assinarSessao, type SessaoPayload, verificarSessao } from "../../domain/sessao.ts";

const NOME_COOKIE = "sessao";
const DURACAO_SESSAO_MS = 7 * 24 * 60 * 60 * 1000;

function obterSegredo(): string {
  const segredo = process.env.AUTH_SECRET;
  if (!segredo) {
    throw new Error("AUTH_SECRET não configurado");
  }
  return segredo;
}

export async function criarSessao(professorId: string): Promise<void> {
  const expiraEm = Date.now() + DURACAO_SESSAO_MS;
  const token = assinarSessao({ professorId, expiraEm }, obterSegredo());

  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiraEm),
  });
}

export async function obterSessao(): Promise<SessaoPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NOME_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return verificarSessao(token, obterSegredo());
}

export async function encerrarSessao(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE);
}
