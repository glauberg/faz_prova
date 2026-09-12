import type { QuestaoBanco } from "./domain/questaoBanco.ts";

const TEMA_PORTUGUES = "Português";
const TEMA_MATEMATICA = "Matemática";

/**
 * 25 questões de nível fundamental para o banco de demonstração:
 * 10 múltipla escolha (A-D), 5 discursivas, 5 dicotômicas (V/F) e
 * 5 resposta única (A-D) — divididas entre Português e Matemática.
 */
export const QUESTOES_BANCO_DEMO: QuestaoBanco[] = [
  // Português — múltipla escolha (5)
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Qual das palavras abaixo é um substantivo?",
      alternativas: ["Correr", "Bonito", "Cadeira", "Rapidamente"],
      gabarito: ["Cadeira"],
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "multipla-escolha",
      enunciado: 'Assinale a alternativa que apresenta um sinônimo de "feliz".',
      alternativas: ["Triste", "Contente", "Zangado", "Cansado"],
      gabarito: ["Contente"],
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "multipla-escolha",
      enunciado: 'Qual é o plural da palavra "papel"?',
      alternativas: ["Papels", "Papeles", "Papéis", "Papeus"],
      gabarito: ["Papéis"],
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Em qual das frases há um verbo no pretérito perfeito?",
      alternativas: ["Eu como pão", "Eu comi pão", "Eu comerei pão", "Eu quero comer"],
      gabarito: ["Eu comi pão"],
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quais das palavras abaixo são adjetivos? (marque todas as corretas)",
      alternativas: ["Bonito", "Correr", "Grande", "Rapidamente"],
      gabarito: ["Bonito", "Grande"],
    },
  },

  // Matemática — múltipla escolha (5)
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quanto é 7 + 8?",
      alternativas: ["14", "15", "16", "17"],
      gabarito: ["15"],
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quanto é 9 x 6?",
      alternativas: ["45", "48", "54", "56"],
      gabarito: ["54"],
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Qual é o resultado de 100 ÷ 4?",
      alternativas: ["20", "25", "30", "40"],
      gabarito: ["25"],
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quais dos números abaixo são pares? (marque todas as corretas)",
      alternativas: ["3", "4", "7", "8"],
      gabarito: ["4", "8"],
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "multipla-escolha",
      enunciado: "Quanto é 12 - 5?",
      alternativas: ["6", "7", "8", "9"],
      gabarito: ["7"],
    },
  },

  // Português — discursivas (3)
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "discursiva",
      enunciado: "Escreva um pequeno parágrafo contando o que você fez no fim de semana.",
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "discursiva",
      enunciado:
        "Explique a diferença entre substantivo próprio e substantivo comum, dando um exemplo de cada.",
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "discursiva",
      enunciado: 'Reescreva a frase "O menino correu rápido" no plural.',
    },
  },

  // Matemática — discursivas (2)
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "discursiva",
      enunciado: "Explique com suas palavras o que é uma fração.",
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "discursiva",
      enunciado:
        "Descreva os passos para resolver uma multiplicação de dois números com dois algarismos cada.",
    },
  },

  // Português — dicotômicas (2)
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "dicotomica",
      enunciado: 'A palavra "casa" é um substantivo.',
      gabarito: true,
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "dicotomica",
      enunciado: 'Todo verbo termina em "-ar".',
      gabarito: false,
    },
  },

  // Matemática — dicotômicas (3)
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "dicotomica",
      enunciado: "O número 10 é par.",
      gabarito: true,
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "dicotomica",
      enunciado: "A soma de dois números ímpares é sempre ímpar.",
      gabarito: false,
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "dicotomica",
      enunciado: "Um triângulo tem quatro lados.",
      gabarito: false,
    },
  },

  // Português — resposta única (3)
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "resposta-unica",
      enunciado: 'Qual é o antônimo de "grande"?',
      alternativas: ["Enorme", "Pequeno", "Alto", "Largo"],
      gabarito: "Pequeno",
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "resposta-unica",
      enunciado: 'Complete: "Os alunos ___ estudando."',
      alternativas: ["está", "estão", "estar", "estive"],
      gabarito: "estão",
    },
  },
  {
    tema: TEMA_PORTUGUES,
    questao: {
      tipo: "resposta-unica",
      enunciado: 'Qual é a classe gramatical da palavra "rapidamente"?',
      alternativas: ["Substantivo", "Adjetivo", "Advérbio", "Verbo"],
      gabarito: "Advérbio",
    },
  },

  // Matemática — resposta única (2)
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "resposta-unica",
      enunciado: "Quanto é a metade de 50?",
      alternativas: ["20", "25", "30", "35"],
      gabarito: "25",
    },
  },
  {
    tema: TEMA_MATEMATICA,
    questao: {
      tipo: "resposta-unica",
      enunciado: "Qual é o dobro de 9?",
      alternativas: ["16", "18", "19", "20"],
      gabarito: "18",
    },
  },
];

export interface ProvaDemo {
  titulo: string;
  tema: string;
}

/** Provas prontas, montadas a partir de todas as questões do banco de cada tema. */
export const PROVAS_DEMO: ProvaDemo[] = [
  { titulo: "Prova de Português", tema: TEMA_PORTUGUES },
  { titulo: "Prova de Matemática", tema: TEMA_MATEMATICA },
];
