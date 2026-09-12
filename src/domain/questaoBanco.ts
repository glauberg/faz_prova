import { type Questao, validarQuestao } from "./questao.ts";

export interface QuestaoBanco {
  tema: string;
  questao: Questao;
}

export interface QuestaoBancoSalva extends QuestaoBanco {
  id: string;
}

export function validarQuestaoBanco(dados: QuestaoBanco): string[] {
  const erros: string[] = [];

  if (!dados.tema || dados.tema.trim() === "") {
    erros.push("tema é obrigatório");
  }

  erros.push(...validarQuestao(dados.questao));

  return erros;
}
