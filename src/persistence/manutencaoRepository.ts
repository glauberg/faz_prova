import { prisma } from "./prisma.ts";

export interface ContagemLimpeza {
  provas: number;
  questoes: number;
  resultadosProva: number;
  resultadosQuestao: number;
  professores: number;
}

export async function limparBaseDeDemonstracao(): Promise<ContagemLimpeza> {
  const [resultadosQuestao, resultadosProva, questoes, provas, professores] =
    await prisma.$transaction([
      prisma.resultadoQuestao.deleteMany(),
      prisma.resultadoProva.deleteMany(),
      prisma.questao.deleteMany(),
      prisma.prova.deleteMany(),
      prisma.professor.deleteMany(),
    ]);

  return {
    provas: provas.count,
    questoes: questoes.count,
    resultadosProva: resultadosProva.count,
    resultadosQuestao: resultadosQuestao.count,
    professores: professores.count,
  };
}
