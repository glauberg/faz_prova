import type { ProvedorIa } from "./tipos.ts";

export class TodosProvedoresFalharamError extends Error {
  causas: Error[];

  constructor(causas: Error[]) {
    super(`todos os provedores de IA falharam: ${causas.map((causa) => causa.message).join("; ")}`);
    this.name = "TodosProvedoresFalharamError";
    this.causas = causas;
  }
}

export interface Carrossel {
  completar(prompt: string): Promise<string>;
}

/**
 * A cada chamada, começa por um provedor diferente (round-robin) e, se ele
 * falhar, tenta os demais em sequência antes de desistir.
 */
export function criarCarrossel(provedores: ProvedorIa[]): Carrossel {
  if (provedores.length === 0) {
    throw new Error("é necessário ao menos um provedor de IA configurado");
  }

  let indiceInicial = 0;

  return {
    async completar(prompt: string): Promise<string> {
      const causas: Error[] = [];

      for (let tentativa = 0; tentativa < provedores.length; tentativa++) {
        const provedor = provedores.at(
          (indiceInicial + tentativa) % provedores.length,
        ) as ProvedorIa;
        try {
          const resultado = await provedor.completar(prompt);
          indiceInicial = (indiceInicial + tentativa + 1) % provedores.length;
          return resultado;
        } catch (erro) {
          causas.push(erro instanceof Error ? erro : new Error(String(erro)));
        }
      }

      indiceInicial = (indiceInicial + 1) % provedores.length;
      throw new TodosProvedoresFalharamError(causas);
    },
  };
}
