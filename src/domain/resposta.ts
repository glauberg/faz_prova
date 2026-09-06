export interface RespostaAluno {
  questaoIndice: number;
  valor: string | boolean;
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
