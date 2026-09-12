import type { Questao } from "../domain/questao.ts";
import { TipoQuestao as TipoQuestaoDb } from "../generated/prisma/client.js";

export function tipoParaDb(tipo: Questao["tipo"]): TipoQuestaoDb {
  switch (tipo) {
    case "discursiva":
      return TipoQuestaoDb.discursiva;
    case "multipla-escolha":
      return TipoQuestaoDb.multipla_escolha;
    case "dicotomica":
      return TipoQuestaoDb.dicotomica;
    case "resposta-unica":
      return TipoQuestaoDb.resposta_unica;
  }
}

export function tipoParaDominio(tipo: TipoQuestaoDb): Questao["tipo"] {
  switch (tipo) {
    case TipoQuestaoDb.discursiva:
      return "discursiva";
    case TipoQuestaoDb.multipla_escolha:
      return "multipla-escolha";
    case TipoQuestaoDb.dicotomica:
      return "dicotomica";
    case TipoQuestaoDb.resposta_unica:
      return "resposta-unica";
  }
}

export interface CamposQuestaoDb {
  tipo: TipoQuestaoDb;
  enunciado: string;
  alternativas: string[];
  gabaritoTexto: string | null;
  gabaritoBooleano: boolean | null;
}

export function questaoParaCampos(questao: Questao): CamposQuestaoDb {
  return {
    tipo: tipoParaDb(questao.tipo),
    enunciado: questao.enunciado,
    alternativas: questao.tipo === "multipla-escolha" ? questao.alternativas : [],
    gabaritoTexto:
      questao.tipo === "multipla-escolha" || questao.tipo === "resposta-unica"
        ? questao.gabarito
        : null,
    gabaritoBooleano: questao.tipo === "dicotomica" ? questao.gabarito : null,
  };
}

export function camposParaQuestao(campos: CamposQuestaoDb): Questao {
  const tipo = tipoParaDominio(campos.tipo);
  switch (tipo) {
    case "discursiva":
      return { tipo, enunciado: campos.enunciado };
    case "multipla-escolha":
      return {
        tipo,
        enunciado: campos.enunciado,
        alternativas: campos.alternativas,
        gabarito: campos.gabaritoTexto ?? "",
      };
    case "dicotomica":
      return { tipo, enunciado: campos.enunciado, gabarito: campos.gabaritoBooleano ?? false };
    case "resposta-unica":
      return { tipo, enunciado: campos.enunciado, gabarito: campos.gabaritoTexto ?? "" };
  }
}
