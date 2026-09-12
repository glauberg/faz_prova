import {
  gerarQuestoes,
  type QuantidadesPorTipo,
} from "../../../../integracoes/llm/gerarQuestoes.ts";
import { obterProvedoresConfigurados } from "../../../../integracoes/llm/provedores.ts";
import { salvarQuestaoBanco } from "../../../../persistence/questaoBancoRepository.ts";
import { obterProfessorAutenticado } from "../../../_auth/exigirProfessor.ts";

interface CorpoRequisicao {
  tema?: string;
  referenciaBibliografica?: string;
  quantidades?: Partial<QuantidadesPorTipo>;
}

export async function POST(request: Request) {
  const professor = await obterProfessorAutenticado();
  if (!professor) {
    return Response.json({ erro: "não autenticado" }, { status: 401 });
  }

  const corpo = (await request.json()) as CorpoRequisicao;

  if (!corpo.tema || corpo.tema.trim() === "") {
    return Response.json({ erro: "tema é obrigatório" }, { status: 400 });
  }
  if (!corpo.referenciaBibliografica || corpo.referenciaBibliografica.trim() === "") {
    return Response.json({ erro: "referência bibliográfica é obrigatória" }, { status: 400 });
  }

  const quantidades: QuantidadesPorTipo = {
    discursiva: corpo.quantidades?.discursiva ?? 0,
    "multipla-escolha": corpo.quantidades?.["multipla-escolha"] ?? 0,
    dicotomica: corpo.quantidades?.dicotomica ?? 0,
    "resposta-unica": corpo.quantidades?.["resposta-unica"] ?? 0,
  };

  const total = Object.values(quantidades).reduce((soma, quantidade) => soma + quantidade, 0);
  if (total === 0) {
    return Response.json({ erro: "informe ao menos uma questão para gerar" }, { status: 400 });
  }

  const provedores = obterProvedoresConfigurados();
  if (provedores.length === 0) {
    return Response.json({ erro: "nenhum provedor de IA configurado" }, { status: 503 });
  }

  try {
    const questoes = await gerarQuestoes(
      provedores,
      corpo.tema,
      corpo.referenciaBibliografica,
      quantidades,
    );

    const salvas = [];
    for (const questao of questoes) {
      const id = await salvarQuestaoBanco({ tema: corpo.tema, questao });
      salvas.push({ id, tema: corpo.tema, questao });
    }

    return Response.json({ questoes: salvas });
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : "falha ao gerar questões";
    return Response.json({ erro: mensagem }, { status: 502 });
  }
}
