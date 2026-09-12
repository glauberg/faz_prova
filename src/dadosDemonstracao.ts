import type { Questao } from "./domain/questao.ts";
import type { RespostaAluno } from "./domain/resposta.ts";

export interface AlunoDemo {
  alunoId: string;
  respostas: RespostaAluno[];
}

export interface ProvaDemo {
  titulo: string;
  questoes: Questao[];
  alunos: AlunoDemo[];
}

export const PROVAS_DEMO: ProvaDemo[] = [
  {
    titulo: "Geografia do Brasil",
    questoes: [
      {
        tipo: "multipla-escolha",
        enunciado: "Qual a capital do Brasil?",
        alternativas: ["São Paulo", "Brasília", "Rio de Janeiro"],
        gabarito: "Brasília",
      },
      {
        tipo: "dicotomica",
        enunciado: "O Brasil faz fronteira com o Chile.",
        gabarito: false,
      },
      {
        tipo: "resposta-unica",
        enunciado: "Qual o maior bioma brasileiro?",
        gabarito: "Amazônia",
      },
      {
        tipo: "discursiva",
        enunciado: "Descreva as cinco regiões do Brasil.",
      },
    ],
    alunos: [
      {
        alunoId: "aluno-demo-1",
        respostas: [
          { questaoIndice: 0, valor: "Brasília" },
          { questaoIndice: 1, valor: false },
          { questaoIndice: 2, valor: "Amazônia" },
        ],
      },
      {
        alunoId: "aluno-demo-2",
        respostas: [
          { questaoIndice: 0, valor: "São Paulo" },
          { questaoIndice: 1, valor: true },
          { questaoIndice: 2, valor: "amazonia" },
        ],
      },
    ],
  },
  {
    titulo: "Matemática básica",
    questoes: [
      { tipo: "resposta-unica", enunciado: "Quanto é 6 x 7?", gabarito: "42" },
      { tipo: "dicotomica", enunciado: "7 é um número primo.", gabarito: true },
      { tipo: "discursiva", enunciado: "Explique o teorema de Pitágoras." },
    ],
    alunos: [
      {
        alunoId: "aluno-demo-1",
        respostas: [
          { questaoIndice: 0, valor: "42" },
          { questaoIndice: 1, valor: true },
        ],
      },
    ],
  },
];
