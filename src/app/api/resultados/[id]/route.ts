import { buscarResultado } from "../../../../persistence/resultadoRepository.ts";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resultado = await buscarResultado(id);

  if (!resultado) {
    return Response.json({ erro: "resultado não encontrado" }, { status: 404 });
  }

  return Response.json({ id, ...resultado });
}
