import type { Prova } from "../domain/prova.ts";
import type { Questao } from "../domain/questao.ts";
import type { Questao as QuestaoDb } from "../generated/prisma/client.js";
import { TipoQuestao as TipoQuestaoDb } from "../generated/prisma/client.js";
import { prisma } from "./prisma.ts";

function tipoParaDb(tipo: Questao["tipo"]): TipoQuestaoDb {
  switch (tipo) {
    case "discursiva":
      return TipoQuestaoDb.discursiva;
    case "multipla-escolha":
      return TipoQuestaoDb.multipla_escolha;
    case "dicotomica":
      return TipoQuestaoDb.dicotomica;
    case "resposta-unica":
      return TipoQuestaoDb.resposta_unica;
  }
}

function questaoParaLinha(questao: Questao, ordem: number) {
  return {
    ordem,
    tipo: tipoParaDb(questao.tipo),
    enunciado: questao.enunciado,
    alternativas: questao.tipo === "multipla-escolha" ? questao.alternativas : [],
    gabaritoTexto:
      questao.tipo === "multipla-escolha" || questao.tipo === "resposta-unica"
        ? questao.gabarito
        : null,
    gabaritoBooleano: questao.tipo === "dicotomica" ? questao.gabarito : null,
  };
}

function linhaParaQuestao(linha: QuestaoDb): Questao {
  switch (linha.tipo) {
    case TipoQuestaoDb.discursiva:
      return { tipo: "discursiva", enunciado: linha.enunciado };
    case TipoQuestaoDb.multipla_escolha:
      return {
        tipo: "multipla-escolha",
        enunciado: linha.enunciado,
        alternativas: linha.alternativas,
        gabarito: linha.gabaritoTexto ?? "",
      };
    case TipoQuestaoDb.dicotomica:
      return {
        tipo: "dicotomica",
        enunciado: linha.enunciado,
        gabarito: linha.gabaritoBooleano ?? false,
      };
    case TipoQuestaoDb.resposta_unica:
      return {
        tipo: "resposta-unica",
        enunciado: linha.enunciado,
        gabarito: linha.gabaritoTexto ?? "",
      };
  }
}

export async function salvarProva(prova: Prova): Promise<string> {
  const criada = await prisma.prova.create({
    data: {
      titulo: prova.titulo,
      questoes: {
        create: prova.questoes.map((questao, indice) => questaoParaLinha(questao, indice)),
      },
    },
  });

  return criada.id;
}

export async function buscarProva(id: string): Promise<Prova | null> {
  const linha = await prisma.prova.findUnique({
    where: { id },
    include: { questoes: { orderBy: { ordem: "asc" } } },
  });

  if (!linha) {
    return null;
  }

  return {
    titulo: linha.titulo,
    questoes: linha.questoes.map(linhaParaQuestao),
  };
}
