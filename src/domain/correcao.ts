import type { Prova } from "./prova.ts";
import type { Questao } from "./questao.ts";
import type { RespostaAluno, ResultadoProva, ResultadoQuestao } from "./resposta.ts";

function respostaEstaCorreta(questao: Questao, valor: string | boolean): boolean {
  switch (questao.tipo) {
    case "multipla-escolha":
      return valor === questao.gabarito;
    case "dicotomica":
      return valor === questao.gabarito;
    case "resposta-unica":
      return typeof valor === "string" && valor.trim() === questao.gabarito.trim();
    case "discursiva":
      return false;
  }
}

export function corrigirProva(prova: Prova, respostas: RespostaAluno[]): ResultadoProva {
  const respostaPorIndice = new Map<number, RespostaAluno>();
  for (const resposta of respostas) {
    if (resposta.questaoIndice >= 0 && resposta.questaoIndice < prova.questoes.length) {
      respostaPorIndice.set(resposta.questaoIndice, resposta);
    }
  }

  const detalhamento: ResultadoQuestao[] = [];
  let acertosObjetivas = 0;
  let totalObjetivas = 0;

  prova.questoes.forEach((questao, indice) => {
    if (questao.tipo === "discursiva") {
      detalhamento.push({ questaoIndice: indice, status: "pendente" });
      return;
    }

    totalObjetivas += 1;
    const resposta = respostaPorIndice.get(indice);
    const acertou = resposta !== undefined && respostaEstaCorreta(questao, resposta.valor);

    if (acertou) {
      acertosObjetivas += 1;
    }
    detalhamento.push({ questaoIndice: indice, status: acertou ? "acertou" : "errou" });
  });

  return { acertosObjetivas, totalObjetivas, detalhamento };
}
