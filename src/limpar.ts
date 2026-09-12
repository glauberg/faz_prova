import { limparBaseDeDemonstracao } from "./persistence/manutencaoRepository.ts";
import { prisma } from "./persistence/prisma.ts";

async function limpar(): Promise<void> {
  const contagem = await limparBaseDeDemonstracao();
  console.log("Base de demonstração limpa:");
  console.log(`  ${contagem.provas} prova(s)`);
  console.log(`  ${contagem.questoes} questão(ões)`);
  console.log(`  ${contagem.resultadosProva} resultado(s) de prova`);
  console.log(`  ${contagem.resultadosQuestao} resultado(s) de questão`);
  console.log(`  ${contagem.professores} professor(es)`);
}

limpar()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
