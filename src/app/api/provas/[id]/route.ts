import { montarProva, type Prova } from "../../../../domain/prova.ts";
import type { QuestaoBancoSalva } from "../../../../domain/questaoBanco.ts";
import {
  atualizarProva,
  buscarProva,
  removerProva,
} from "../../../../persistence/provaRepository.ts";
import { buscarQuestoesBancoPorIds } from "../../../../persistence/questaoBancoRepository.ts";
import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

interface CorpoAtualizacao {
  titulo?: string;
  questaoBancoIds?: string[];
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const prova = await buscarProva(id);

  if (!prova) {
    return Response.json({ erro: "prova não encontrada" }, { status: 404 });
  }

  return Response.json({ id, ...prova });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const corpo = (await request.json()) as CorpoAtualizacao;
  const questaoBancoIds = corpo.questaoBancoIds ?? [];
  if (questaoBancoIds.length === 0) {
    return Response.json({ erro: "selecione ao menos uma questão do banco" }, { status: 400 });
  }

  const encontradas = await buscarQuestoesBancoPorIds(questaoBancoIds);
  const faltantes = questaoBancoIds.filter((bancoId) => !encontradas.has(bancoId));
  if (faltantes.length > 0) {
    return Response.json(
      { erro: `questões não encontradas no banco: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  const questoes = questaoBancoIds
    .map((bancoId) => encontradas.get(bancoId))
    .filter((item): item is QuestaoBancoSalva => item !== undefined)
    .map((item) => item.questao);

  let prova: Prova;
  try {
    prova = montarProva({ titulo: corpo.titulo ?? "", questoes });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "dados inválidos";
    return Response.json({ erro: mensagem }, { status: 400 });
  }

  const atualizada = await atualizarProva(id, prova, questaoBancoIds);
  if (!atualizada) {
    return Response.json({ erro: "prova não encontrada" }, { status: 404 });
  }

  return Response.json({ id, ...prova });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const removida = await removerProva(id);
  if (!removida) {
    return Response.json({ erro: "prova não encontrada" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
