import { type QuestaoBanco, validarQuestaoBanco } from "../../../../domain/questaoBanco.ts";
import {
  atualizarQuestaoBanco,
  buscarQuestaoBancoPorId,
  removerQuestaoBanco,
} from "../../../../persistence/questaoBancoRepository.ts";
import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const questao = await buscarQuestaoBancoPorId(id);
  if (!questao) {
    return Response.json({ erro: "questão não encontrada" }, { status: 404 });
  }

  return Response.json(questao);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const dados = (await request.json()) as QuestaoBanco;
  const erros = validarQuestaoBanco(dados);
  if (erros.length > 0) {
    return Response.json({ erro: erros.join("; ") }, { status: 400 });
  }

  const atualizada = await atualizarQuestaoBanco(id, dados);
  if (!atualizada) {
    return Response.json({ erro: "questão não encontrada" }, { status: 404 });
  }

  return Response.json({ id, ...dados });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const removida = await removerQuestaoBanco(id);
  if (!removida) {
    return Response.json({ erro: "questão não encontrada" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
