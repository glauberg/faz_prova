import { buscarProva } from "../../../../persistence/provaRepository.ts";
import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

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
