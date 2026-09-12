import type { ProvedorIa } from "./tipos.ts";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODELO_PADRAO = "openai/gpt-4o-mini";

export function criarProvedorOpenRouter(): ProvedorIa | null {
  const chaveApi = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  if (!chaveApi) {
    return null;
  }

  const modelo = process.env.OPENROUTER_MODEL ?? MODELO_PADRAO;

  return {
    nome: "openrouter",
    async completar(prompt: string): Promise<string> {
      const resposta = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          // biome-ignore lint/style/useNamingConvention: nome do cabeçalho HTTP, não é uma propriedade nossa
          Authorization: `Bearer ${chaveApi}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelo,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!resposta.ok) {
        throw new Error(`openrouter respondeu ${resposta.status}: ${await resposta.text()}`);
      }

      const dados = await resposta.json();
      const texto = dados.choices?.[0]?.message?.content;
      if (typeof texto !== "string") {
        throw new Error("openrouter não retornou conteúdo de texto");
      }
      return texto;
    },
  };
}
