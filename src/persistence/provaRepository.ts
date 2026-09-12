import type { Prova } from "../domain/prova.ts";
import { prisma } from "./prisma.ts";
import { camposParaQuestao, questaoParaCampos } from "./questaoMapper.ts";

export interface ProvaComOrigens extends Prova {
  questaoBancoIds: (string | null)[];
}

export interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
  createdAt: Date;
}

export async function salvarProva(
  prova: Prova,
  questaoBancoIds: (string | null)[] = [],
): Promise<string> {
  const criada = await prisma.prova.create({
    data: {
      titulo: prova.titulo,
      questoes: {
        create: prova.questoes.map((questao, indice) => ({
          ordem: indice,
          ...questaoParaCampos(questao),
          origemBancoId: questaoBancoIds[indice] ?? null,
        })),
      },
    },
  });

  return criada.id;
}

export async function buscarProva(id: string): Promise<ProvaComOrigens | null> {
  const linha = await prisma.prova.findUnique({
    where: { id },
    include: { questoes: { orderBy: { ordem: "asc" } } },
  });

  if (!linha) {
    return null;
  }

  return {
    titulo: linha.titulo,
    questoes: linha.questoes.map(camposParaQuestao),
    questaoBancoIds: linha.questoes.map((questao) => questao.origemBancoId),
  };
}

export async function listarProvas(): Promise<ProvaResumo[]> {
  const linhas = await prisma.prova.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { questoes: true } } },
  });

  return linhas.map((linha) => ({
    id: linha.id,
    titulo: linha.titulo,
    quantidadeQuestoes: linha._count.questoes,
    createdAt: linha.createdAt,
  }));
}

export async function atualizarProva(
  id: string,
  prova: Prova,
  questaoBancoIds: (string | null)[] = [],
): Promise<boolean> {
  const existente = await prisma.prova.findUnique({ where: { id }, select: { id: true } });
  if (!existente) {
    return false;
  }

  await prisma.$transaction([
    prisma.resultadoQuestao.deleteMany({ where: { resultadoProva: { provaId: id } } }),
    prisma.resultadoProva.deleteMany({ where: { provaId: id } }),
    prisma.questao.deleteMany({ where: { provaId: id } }),
    prisma.prova.update({
      where: { id },
      data: {
        titulo: prova.titulo,
        questoes: {
          create: prova.questoes.map((questao, indice) => ({
            ordem: indice,
            ...questaoParaCampos(questao),
            origemBancoId: questaoBancoIds[indice] ?? null,
          })),
        },
      },
    }),
  ]);

  return true;
}

export async function removerProva(id: string): Promise<boolean> {
  const [, , , prova] = await prisma.$transaction([
    prisma.resultadoQuestao.deleteMany({ where: { resultadoProva: { provaId: id } } }),
    prisma.resultadoProva.deleteMany({ where: { provaId: id } }),
    prisma.questao.deleteMany({ where: { provaId: id } }),
    prisma.prova.deleteMany({ where: { id } }),
  ]);

  return prova.count > 0;
}
