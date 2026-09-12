import type { Questao } from "../../domain/questao.ts";

export interface QuestaoRascunho {
  tipo: Questao["tipo"];
  enunciado: string;
  alternativasTexto: string;
  gabaritoTexto: string;
  gabaritoBooleano: boolean;
}

export function novaQuestaoRascunho(): QuestaoRascunho {
  return {
    tipo: "discursiva",
    enunciado: "",
    alternativasTexto: "",
    gabaritoTexto: "",
    gabaritoBooleano: true,
  };
}

export function paraQuestaoRascunho(questao: Questao): QuestaoRascunho {
  const base: QuestaoRascunho = {
    tipo: questao.tipo,
    enunciado: questao.enunciado,
    alternativasTexto: "",
    gabaritoTexto: "",
    gabaritoBooleano: true,
  };

  switch (questao.tipo) {
    case "discursiva":
      return base;
    case "multipla-escolha":
      return {
        ...base,
        alternativasTexto: questao.alternativas.join("\n"),
        gabaritoTexto: questao.gabarito,
      };
    case "dicotomica":
      return { ...base, gabaritoBooleano: questao.gabarito };
    case "resposta-unica":
      return { ...base, gabaritoTexto: questao.gabarito };
  }
}

export function paraQuestaoDominio(rascunho: QuestaoRascunho): Questao {
  switch (rascunho.tipo) {
    case "discursiva":
      return { tipo: "discursiva", enunciado: rascunho.enunciado };
    case "multipla-escolha":
      return {
        tipo: "multipla-escolha",
        enunciado: rascunho.enunciado,
        alternativas: rascunho.alternativasTexto
          .split("\n")
          .map((linha) => linha.trim())
          .filter((linha) => linha.length > 0),
        gabarito: rascunho.gabaritoTexto,
      };
    case "dicotomica":
      return {
        tipo: "dicotomica",
        enunciado: rascunho.enunciado,
        gabarito: rascunho.gabaritoBooleano,
      };
    case "resposta-unica":
      return {
        tipo: "resposta-unica",
        enunciado: rascunho.enunciado,
        gabarito: rascunho.gabaritoTexto,
      };
  }
}
