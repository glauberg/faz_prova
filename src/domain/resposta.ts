export interface RespostaAluno {
  questaoIndice: number;
  /** string[] para múltipla escolha (uma ou mais alternativas marcadas) */
  valor: string | boolean | string[];
}

export type StatusQuestao = "acertou" | "errou" | "pendente";

export interface ResultadoQuestao {
  questaoIndice: number;
  status: StatusQuestao;
}

export interface ResultadoProva {
  acertosObjetivas: number;
  totalObjetivas: number;
  detalhamento: ResultadoQuestao[];
}
