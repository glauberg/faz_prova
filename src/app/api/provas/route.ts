import { montarProva, type Prova } from "../../../domain/prova.ts";
import type { QuestaoBancoSalva } from "../../../domain/questaoBanco.ts";
import { listarProvas, salvarProva } from "../../../persistence/provaRepository.ts";
import { buscarQuestoesBancoPorIds } from "../../../persistence/questaoBancoRepository.ts";
import { obterProfessorAutenticado } from "../../_auth/exigirProfessor.ts";

interface CorpoRequisicao {
  titulo?: string;
  questaoBancoIds?: string[];
}

export async function GET() {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const provas = await listarProvas();
  return Response.json({ provas });
}

export async function POST(request: Request) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const corpo = (await request.json()) as CorpoRequisicao;
  const questaoBancoIds = corpo.questaoBancoIds ?? [];
  if (questaoBancoIds.length === 0) {
    return Response.json({ erro: "selecione ao menos uma questão do banco" }, { status: 400 });
  }

  const encontradas = await buscarQuestoesBancoPorIds(questaoBancoIds);
  const faltantes = questaoBancoIds.filter((id) => !encontradas.has(id));
  if (faltantes.length > 0) {
    return Response.json(
      { erro: `questões não encontradas no banco: ${faltantes.join(", ")}` },
      { status: 400 },
    );
  }

  const questoes = questaoBancoIds
    .map((id) => encontradas.get(id))
    .filter((item): item is QuestaoBancoSalva => item !== undefined)
    .map((item) => item.questao);

  let prova: Prova;
  try {
    prova = montarProva({ titulo: corpo.titulo ?? "", questoes });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "dados inválidos";
    return Response.json({ erro: mensagem }, { status: 400 });
  }

  const id = await salvarProva(prova, questaoBancoIds);
  return Response.json({ id, ...prova }, { status: 201 });
}
