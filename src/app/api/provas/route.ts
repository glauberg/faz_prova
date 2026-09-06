import { type DadosProva, montarProva, type Prova } from "../../../domain/prova.ts";
import { salvarProva } from "../../../persistence/provaRepository.ts";

export async function POST(request: Request) {
  const dados = (await request.json()) as DadosProva;

  let prova: Prova;
  try {
    prova = montarProva(dados);
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "dados inválidos";
    return Response.json({ erro: mensagem }, { status: 400 });
  }

  const id = await salvarProva(prova);

  return Response.json({ id, ...prova }, { status: 201 });
}
