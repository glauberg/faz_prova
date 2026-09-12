import { PROVAS_DEMO } from "./dadosDemonstracao.ts";
import { corrigirProva } from "./domain/correcao.ts";
import { montarProva } from "./domain/prova.ts";
import { prisma } from "./persistence/prisma.ts";
import { salvarProva } from "./persistence/provaRepository.ts";
import { salvarResultado } from "./persistence/resultadoRepository.ts";

async function povoar(): Promise<void> {
  for (const provaDemo of PROVAS_DEMO) {
    const prova = montarProva({ titulo: provaDemo.titulo, questoes: provaDemo.questoes });
    const provaId = await salvarProva(prova);
    console.log(`Prova criada: "${prova.titulo}" (${provaId})`);

    for (const aluno of provaDemo.alunos) {
      const resultado = corrigirProva(prova, aluno.respostas);
      const resultadoId = await salvarResultado(provaId, aluno.alunoId, resultado);
      console.log(
        `  Resultado de ${aluno.alunoId}: ${resultado.acertosObjetivas}/${resultado.totalObjetivas} objetivas corretas (${resultadoId})`,
      );
    }
  }
}

povoar()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
