import { type Questao, validarQuestao } from "./questao.ts";

export interface Prova {
  titulo: string;
  questoes: Questao[];
}

export interface DadosProva {
  titulo: string;
  questoes: Questao[];
}

export function montarProva(dados: DadosProva): Prova {
  if (dados.questoes.length === 0) {
    throw new Error("prova deve conter ao menos uma questão");
  }

  for (const [indice, questao] of dados.questoes.entries()) {
    const erros = validarQuestao(questao);
    if (erros.length > 0) {
      throw new Error(`questão ${indice + 1} inválida: ${erros.join("; ")}`);
    }
  }

  return { titulo: dados.titulo, questoes: dados.questoes };
}
