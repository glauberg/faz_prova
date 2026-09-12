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
  id?: string;
  alunoId?: string;
  provaId?: string;
  provaTitulo?: string;
  createdAt?: string;
  acertosObjetivas: number;
  totalObjetivas: number;
  detalhamento: ResultadoQuestao[];
}
