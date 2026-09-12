import { type Questao, validarQuestao } from "./questao.ts";

export interface PedidoGeracaoQuestao {
  tema: string;
  referenciaBibliografica: string;
  tipo: Questao["tipo"];
}

const FORMATO_POR_TIPO: Record<Questao["tipo"], string> = {
  discursiva: '{"enunciado": "..."}',
  "multipla-escolha":
    '{"enunciado": "...", "alternativas": ["...", "...", "..."], "gabarito": "<uma das alternativas, exatamente igual>"}',
  dicotomica: '{"enunciado": "...", "gabarito": true}',
  "resposta-unica": '{"enunciado": "...", "gabarito": "..."}',
};

export function montarPromptQuestao(pedido: PedidoGeracaoQuestao): string {
  return [
    `Você é um professor elaborando uma questão de avaliação sobre o tema "${pedido.tema}", com base na referência bibliográfica "${pedido.referenciaBibliografica}".`,
    `Elabore uma única questão do tipo "${pedido.tipo}", em português.`,
    "Responda APENAS com um objeto JSON válido, sem markdown e sem comentários, exatamente no formato:",
    FORMATO_POR_TIPO[pedido.tipo],
  ].join("\n");
}

function paraBooleano(valor: unknown): boolean {
  if (typeof valor === "boolean") {
    return valor;
  }
  if (typeof valor === "string") {
    return valor.trim().toLowerCase() === "true";
  }
  return Boolean(valor);
}

function extrairJson(textoResposta: string): Record<string, unknown> {
  const semFences = textoResposta
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    return JSON.parse(semFences) as Record<string, unknown>;
  } catch {
    throw new Error(`resposta da IA não é um JSON válido: ${textoResposta}`);
  }
}

export function interpretarQuestaoGerada(tipo: Questao["tipo"], textoResposta: string): Questao {
  const bruto = extrairJson(textoResposta);
  const enunciado = String(bruto.enunciado ?? "");

  let questao: Questao;
  switch (tipo) {
    case "discursiva":
      questao = { tipo: "discursiva", enunciado };
      break;
    case "multipla-escolha":
      questao = {
        tipo: "multipla-escolha",
        enunciado,
        alternativas: Array.isArray(bruto.alternativas) ? bruto.alternativas.map(String) : [],
        gabarito: String(bruto.gabarito ?? ""),
      };
      break;
    case "dicotomica":
      questao = { tipo: "dicotomica", enunciado, gabarito: paraBooleano(bruto.gabarito) };
      break;
    case "resposta-unica":
      questao = { tipo: "resposta-unica", enunciado, gabarito: String(bruto.gabarito ?? "") };
      break;
  }

  const erros = validarQuestao(questao);
  if (erros.length > 0) {
    throw new Error(`questão gerada pela IA é inválida: ${erros.join("; ")}`);
  }

  return questao;
}
