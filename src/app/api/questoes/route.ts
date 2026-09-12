import type { Questao } from "../../../domain/questao.ts";
import { type QuestaoBanco, validarQuestaoBanco } from "../../../domain/questaoBanco.ts";
import {
  listarQuestoesBanco,
  salvarQuestaoBanco,
} from "../../../persistence/questaoBancoRepository.ts";
import { obterProfessorAutenticado } from "../../_auth/exigirProfessor.ts";

const TIPOS_VALIDOS: Questao["tipo"][] = [
  "discursiva",
  "multipla-escolha",
  "dicotomica",
  "resposta-unica",
];

export async function GET(request: Request) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const tema = url.searchParams.get("tema") ?? undefined;
  const tipoParam = url.searchParams.get("tipo");
  const tipo =
    tipoParam && TIPOS_VALIDOS.includes(tipoParam as Questao["tipo"])
      ? (tipoParam as Questao["tipo"])
      : undefined;

  const questoes = await listarQuestoesBanco({ tema, tipo });
  return Response.json({ questoes });
}

export async function POST(request: Request) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const dados = (await request.json()) as QuestaoBanco;
  const erros = validarQuestaoBanco(dados);
  if (erros.length > 0) {
    return Response.json({ erro: erros.join("; ") }, { status: 400 });
  }

  const id = await salvarQuestaoBanco(dados);
  return Response.json({ id, ...dados }, { status: 201 });
}
