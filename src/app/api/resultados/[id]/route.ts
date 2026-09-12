import { buscarResultado } from "../../../../persistence/resultadoRepository.ts";
import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const resultado = await buscarResultado(id);

  if (!resultado) {
    return Response.json({ erro: "resultado não encontrado" }, { status: 404 });
  }

  return Response.json({ id, ...resultado });
}
