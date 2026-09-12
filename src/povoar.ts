import { PROVAS_DEMO, QUESTOES_BANCO_DEMO } from "./dadosDemonstracao.ts";
import { corrigirProva } from "./domain/correcao.ts";
import { montarProva, type Prova } from "./domain/prova.ts";
import type { Questao } from "./domain/questao.ts";
import type { RespostaAluno } from "./domain/resposta.ts";
import { prisma } from "./persistence/prisma.ts";
import { criarOuAtualizarProfessor } from "./persistence/professorRepository.ts";
import { salvarProva } from "./persistence/provaRepository.ts";
import {
  buscarQuestoesBancoPorIds,
  salvarQuestaoBanco,
} from "./persistence/questaoBancoRepository.ts";
import { salvarResultado } from "./persistence/resultadoRepository.ts";

function respostaCorreta(questao: Questao): string | boolean | string[] | undefined {
  switch (questao.tipo) {
    case "multipla-escolha":
    case "dicotomica":
    case "resposta-unica":
      return questao.gabarito;
    case "discursiva":
      return undefined;
  }
}

function respostaErrada(questao: Questao): string | boolean | string[] {
  switch (questao.tipo) {
    case "multipla-escolha": {
      const errada = questao.alternativas.find(
        (alternativa) => !questao.gabarito.includes(alternativa),
      );
      return errada ? [errada] : [];
    }
    case "dicotomica":
      return !questao.gabarito;
    case "resposta-unica": {
      const errada = questao.alternativas.find((alternativa) => alternativa !== questao.gabarito);
      return errada ?? "";
    }
    case "discursiva":
      return "";
  }
}

function respostasDoAluno(prova: Prova, errarPrimeiraObjetiva: boolean): RespostaAluno[] {
  const respostas: RespostaAluno[] = [];
  let jaErrou = false;

  prova.questoes.forEach((questao, questaoIndice) => {
    const correta = respostaCorreta(questao);
    if (correta === undefined) {
      return;
    }
    if (errarPrimeiraObjetiva && !jaErrou) {
      jaErrou = true;
      respostas.push({ questaoIndice, valor: respostaErrada(questao) });
      return;
    }
    respostas.push({ questaoIndice, valor: correta });
  });

  return respostas;
}

async function povoar(): Promise<void> {
  await criarOuAtualizarProfessor("profteste", "prof123");
  console.log('Professor de demonstração pronto: usuário "profteste", senha "prof123"');

  const idsPorTema = new Map<string, string[]>();
  for (const item of QUESTOES_BANCO_DEMO) {
    const id = await salvarQuestaoBanco(item);
    const ids = idsPorTema.get(item.tema) ?? [];
    ids.push(id);
    idsPorTema.set(item.tema, ids);
  }
  console.log(`${QUESTOES_BANCO_DEMO.length} questões criadas no banco de demonstração`);

  for (const provaDemo of PROVAS_DEMO) {
    const questaoBancoIds = idsPorTema.get(provaDemo.tema) ?? [];
    const encontradas = await buscarQuestoesBancoPorIds(questaoBancoIds);
    const questoes = questaoBancoIds
      .map((id) => encontradas.get(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined)
      .map((item) => item.questao);

    const prova = montarProva({ titulo: provaDemo.titulo, questoes });
    const provaId = await salvarProva(prova, questaoBancoIds);
    console.log(`Prova criada: "${prova.titulo}" (${provaId}), ${prova.questoes.length} questões`);

    const alunos = [
      { alunoId: "aluno-demo-1", errarPrimeiraObjetiva: false },
      { alunoId: "aluno-demo-2", errarPrimeiraObjetiva: true },
    ];

    for (const aluno of alunos) {
      const respostas = respostasDoAluno(prova, aluno.errarPrimeiraObjetiva);
      const resultado = corrigirProva(prova, respostas);
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
