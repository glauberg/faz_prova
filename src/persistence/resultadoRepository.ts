import type { ResultadoProva, ResultadoQuestao, StatusQuestao } from "../domain/resposta.ts";
import { StatusQuestaoResultado as StatusDb } from "../generated/prisma/client.js";
import { prisma } from "./prisma.ts";

export class ProvaNaoEncontradaError extends Error {
  constructor(provaId: string) {
    super(`prova ${provaId} não encontrada`);
    this.name = "ProvaNaoEncontradaError";
  }
}

function statusParaDb(status: StatusQuestao): StatusDb {
  switch (status) {
    case "acertou":
      return StatusDb.acertou;
    case "errou":
      return StatusDb.errou;
    case "pendente":
      return StatusDb.pendente;
  }
}

function statusParaDominio(status: StatusDb): StatusQuestao {
  switch (status) {
    case StatusDb.acertou:
      return "acertou";
    case StatusDb.errou:
      return "errou";
    case StatusDb.pendente:
      return "pendente";
  }
}

export async function salvarResultado(
  provaId: string,
  alunoId: string,
  resultado: ResultadoProva,
): Promise<string> {
  const questoesDaProva = await prisma.questao.findMany({
    where: { provaId },
    orderBy: { ordem: "asc" },
    select: { id: true },
  });

  if (questoesDaProva.length === 0) {
    throw new ProvaNaoEncontradaError(provaId);
  }

  const criado = await prisma.resultadoProva.create({
    data: {
      provaId,
      alunoId,
      acertosObjetivas: resultado.acertosObjetivas,
      totalObjetivas: resultado.totalObjetivas,
      detalhamento: {
        create: resultado.detalhamento.map((item) => {
          const questao = questoesDaProva[item.questaoIndice];
          if (!questao) {
            throw new Error(`questão de índice ${item.questaoIndice} não pertence à prova`);
          }
          return { questaoId: questao.id, status: statusParaDb(item.status) };
        }),
      },
    },
  });

  return criado.id;
}

export async function buscarResultado(id: string): Promise<ResultadoProva | null> {
  const linha = await prisma.resultadoProva.findUnique({
    where: { id },
    include: {
      prova: { select: { id: true, titulo: true } },
      detalhamento: {
        include: { questao: { select: { ordem: true } } },
        orderBy: { questao: { ordem: "asc" } },
      },
    },
  });

  if (!linha) {
    return null;
  }

  const detalhamento: ResultadoQuestao[] = linha.detalhamento.map((item) => ({
    questaoIndice: item.questao.ordem,
    status: statusParaDominio(item.status),
  }));

  return {
    id: linha.id,
    alunoId: linha.alunoId,
    provaId: linha.provaId,
    provaTitulo: linha.prova.titulo,
    createdAt: linha.createdAt.toISOString(),
    acertosObjetivas: linha.acertosObjetivas,
    totalObjetivas: linha.totalObjetivas,
    detalhamento,
  };
}
