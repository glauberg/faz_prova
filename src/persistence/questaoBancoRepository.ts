import type { Questao } from "../domain/questao.ts";
import type { QuestaoBanco, QuestaoBancoSalva } from "../domain/questaoBanco.ts";
import type { QuestaoBanco as QuestaoBancoDb } from "../generated/prisma/client.js";
import { prisma } from "./prisma.ts";
import { camposParaQuestao, questaoParaCampos, tipoParaDb } from "./questaoMapper.ts";

export interface FiltroQuestaoBanco {
  tema?: string;
  tipo?: Questao["tipo"];
}

function linhaParaQuestaoBanco(linha: QuestaoBancoDb): QuestaoBancoSalva {
  return { id: linha.id, tema: linha.tema, questao: camposParaQuestao(linha) };
}

export async function salvarQuestaoBanco(dados: QuestaoBanco): Promise<string> {
  const criada = await prisma.questaoBanco.create({
    data: { tema: dados.tema, ...questaoParaCampos(dados.questao) },
  });

  return criada.id;
}

export async function listarQuestoesBanco(
  filtro: FiltroQuestaoBanco = {},
): Promise<QuestaoBancoSalva[]> {
  const linhas = await prisma.questaoBanco.findMany({
    where: {
      ...(filtro.tema ? { tema: { contains: filtro.tema, mode: "insensitive" } } : {}),
      ...(filtro.tipo ? { tipo: tipoParaDb(filtro.tipo) } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return linhas.map(linhaParaQuestaoBanco);
}

export async function buscarQuestaoBancoPorId(id: string): Promise<QuestaoBancoSalva | null> {
  const linha = await prisma.questaoBanco.findUnique({ where: { id } });
  return linha ? linhaParaQuestaoBanco(linha) : null;
}

export async function buscarQuestoesBancoPorIds(
  ids: string[],
): Promise<Map<string, QuestaoBancoSalva>> {
  const linhas = await prisma.questaoBanco.findMany({ where: { id: { in: ids } } });
  return new Map(linhas.map((linha) => [linha.id, linhaParaQuestaoBanco(linha)]));
}

export async function atualizarQuestaoBanco(id: string, dados: QuestaoBanco): Promise<boolean> {
  const resultado = await prisma.questaoBanco.updateMany({
    where: { id },
    data: { tema: dados.tema, ...questaoParaCampos(dados.questao) },
  });

  return resultado.count > 0;
}

export async function removerQuestaoBanco(id: string): Promise<boolean> {
  const resultado = await prisma.questaoBanco.deleteMany({ where: { id } });
  return resultado.count > 0;
}
