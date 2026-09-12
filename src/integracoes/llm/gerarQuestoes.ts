import {
  interpretarQuestaoGerada,
  montarPromptQuestao,
  type PedidoGeracaoQuestao,
} from "../../domain/geracaoQuestoes.ts";
import type { Questao } from "../../domain/questao.ts";
import { criarCarrossel } from "./carrossel.ts";
import type { ProvedorIa } from "./tipos.ts";

export interface QuantidadesPorTipo {
  discursiva: number;
  "multipla-escolha": number;
  dicotomica: number;
  "resposta-unica": number;
}

function montarPedidos(
  tema: string,
  referenciaBibliografica: string,
  quantidades: QuantidadesPorTipo,
): PedidoGeracaoQuestao[] {
  const pedidos: PedidoGeracaoQuestao[] = [];

  for (const tipo of Object.keys(quantidades) as Questao["tipo"][]) {
    for (let i = 0; i < quantidades[tipo]; i++) {
      pedidos.push({ tema, referenciaBibliografica, tipo });
    }
  }

  return pedidos;
}

export async function gerarQuestoes(
  provedores: ProvedorIa[],
  tema: string,
  referenciaBibliografica: string,
  quantidades: QuantidadesPorTipo,
): Promise<Questao[]> {
  const carrossel = criarCarrossel(provedores);
  const pedidos = montarPedidos(tema, referenciaBibliografica, quantidades);

  const questoes: Questao[] = [];
  for (const pedido of pedidos) {
    const prompt = montarPromptQuestao(pedido);
    const textoResposta = await carrossel.completar(prompt);
    questoes.push(interpretarQuestaoGerada(pedido.tipo, textoResposta));
  }

  return questoes;
}
