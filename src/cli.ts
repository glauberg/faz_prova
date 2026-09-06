import { montarProva } from "./domain/prova.ts";
import { corrigirProva } from "./domain/correcao.ts";
import type { Questao } from "./domain/questao.ts";
import type { RespostaAluno } from "./domain/resposta.ts";

const questoes: Questao[] = [
  {
    tipo: "multipla-escolha",
    enunciado: "Qual a capital do Brasil?",
    alternativas: ["São Paulo", "Brasília", "Rio de Janeiro"],
    gabarito: "Brasília",
  },
  { tipo: "dicotomica", enunciado: "A Terra é redonda.", gabarito: true },
  { tipo: "resposta-unica", enunciado: "Quanto é 6 x 7?", gabarito: "42" },
  { tipo: "discursiva", enunciado: "Explique o ciclo da água." },
];

const prova = montarProva({ titulo: "Prova de exemplo", questoes });

console.log(`Prova: "${prova.titulo}" (${prova.questoes.length} questões)\n`);
prova.questoes.forEach((questao, indice) => {
  console.log(`  ${indice + 1}. [${questao.tipo}] ${questao.enunciado}`);
});

const respostasDoAluno: RespostaAluno[] = [
  { questaoIndice: 0, valor: "Brasília" },
  { questaoIndice: 1, valor: false },
  { questaoIndice: 2, valor: "42" },
];

const resultado = corrigirProva(prova, respostasDoAluno);

console.log(
  `\nCorreção: ${resultado.acertosObjetivas}/${resultado.totalObjetivas} questões objetivas corretas\n`,
);
resultado.detalhamento.forEach((item) => {
  const enunciado = prova.questoes[item.questaoIndice]?.enunciado;
  console.log(`  Questão ${item.questaoIndice + 1} (${enunciado}): ${item.status}`);
});
