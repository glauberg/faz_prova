import { prisma } from "./prisma.ts";

export interface ContagemLimpeza {
  provas: number;
  questoes: number;
  questoesBanco: number;
  resultadosProva: number;
  resultadosQuestao: number;
  professores: number;
}

export async function limparBaseDeDemonstracao(): Promise<ContagemLimpeza> {
  const [resultadosQuestao, resultadosProva, questoes, provas, questoesBanco, professores] =
    await prisma.$transaction([
      prisma.resultadoQuestao.deleteMany(),
      prisma.resultadoProva.deleteMany(),
      prisma.questao.deleteMany(),
      prisma.prova.deleteMany(),
      prisma.questaoBanco.deleteMany(),
      prisma.professor.deleteMany(),
    ]);

  return {
    provas: provas.count,
    questoes: questoes.count,
    questoesBanco: questoesBanco.count,
    resultadosProva: resultadosProva.count,
    resultadosQuestao: resultadosQuestao.count,
    professores: professores.count,
  };
}
