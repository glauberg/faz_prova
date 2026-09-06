import { buscarProva } from "../../../../persistence/provaRepository.ts";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prova = await buscarProva(id);

  if (!prova) {
    return Response.json({ erro: "prova não encontrada" }, { status: 404 });
  }

  return Response.json({ id, ...prova });
}
