export interface QuestaoDiscursiva {
  tipo: "discursiva";
  enunciado: string;
}

export interface QuestaoMultiplaEscolha {
  tipo: "multipla-escolha";
  enunciado: string;
  alternativas: string[];
  /** uma ou mais alternativas corretas */
  gabarito: string[];
}

export interface QuestaoDicotomica {
  tipo: "dicotomica";
  enunciado: string;
  gabarito: boolean;
}

export interface QuestaoRespostaUnica {
  tipo: "resposta-unica";
  enunciado: string;
  alternativas: string[];
  /** exatamente uma alternativa correta */
  gabarito: string;
}

export type Questao =
  | QuestaoDiscursiva
  | QuestaoMultiplaEscolha
  | QuestaoDicotomica
  | QuestaoRespostaUnica;

export function validarQuestao(questao: Questao): string[] {
  const erros: string[] = [];

  if (!questao.enunciado || questao.enunciado.trim() === "") {
    erros.push("enunciado é obrigatório");
    return erros;
  }

  switch (questao.tipo) {
    case "discursiva":
      break;
    case "multipla-escolha":
      if (!questao.alternativas || questao.alternativas.length < 2) {
        erros.push("questão de múltipla escolha exige ao menos duas alternativas");
      }
      if (!questao.gabarito || questao.gabarito.length === 0) {
        erros.push("gabarito é obrigatório");
      } else if (questao.gabarito.some((item) => !questao.alternativas?.includes(item))) {
        erros.push("gabarito deve corresponder a alternativas existentes");
      }
      break;
    case "dicotomica":
      if (typeof questao.gabarito !== "boolean") {
        erros.push("gabarito é obrigatório");
      }
      break;
    case "resposta-unica":
      if (!questao.alternativas || questao.alternativas.length < 2) {
        erros.push("questão de resposta única exige ao menos duas alternativas");
      }
      if (!questao.gabarito || questao.gabarito.trim() === "") {
        erros.push("gabarito é obrigatório");
      } else if (!questao.alternativas?.includes(questao.gabarito)) {
        erros.push("gabarito deve corresponder a uma das alternativas");
      }
      break;
  }

  return erros;
}
