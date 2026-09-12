import { corrigirProva } from "../../../../../domain/correcao.ts";
import type { RespostaAluno } from "../../../../../domain/resposta.ts";
import { buscarProva } from "../../../../../persistence/provaRepository.ts";
import { salvarResultado } from "../../../../../persistence/resultadoRepository.ts";
import { obterProfessorAutenticado } from "../../../../_auth/exigirProfessor.ts";

interface CorpoCorrecao {
  alunoId: string;
  respostas: RespostaAluno[];
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const prova = await buscarProva(id);

  if (!prova) {
    return Response.json({ erro: "prova não encontrada" }, { status: 404 });
  }

  const { alunoId, respostas } = (await request.json()) as CorpoCorrecao;

  const resultado = corrigirProva(prova, respostas);
  const resultadoId = await salvarResultado(id, alunoId, resultado);

  return Response.json({ id: resultadoId, ...resultado }, { status: 201 });
}
