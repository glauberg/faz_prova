import { criarProvedorGroq } from "./groq.ts";
import { criarProvedorOpenRouter } from "./openrouter.ts";
import type { ProvedorIa } from "./tipos.ts";

export function obterProvedoresConfigurados(): ProvedorIa[] {
  return [criarProvedorOpenRouter(), criarProvedorGroq()].filter(
    (provedor): provedor is ProvedorIa => provedor !== null,
  );
}
