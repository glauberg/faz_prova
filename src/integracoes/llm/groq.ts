import type { ProvedorIa } from "./tipos.ts";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODELO_PADRAO = "llama-3.1-8b-instant";

export function criarProvedorGroq(): ProvedorIa | null {
  const chaveApi = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!chaveApi) {
    return null;
  }

  const modelo = process.env.GROQ_MODEL ?? MODELO_PADRAO;

  return {
    nome: "groq",
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
        throw new Error(`groq respondeu ${resposta.status}: ${await resposta.text()}`);
      }

      const dados = await resposta.json();
      const texto = dados.choices?.[0]?.message?.content;
      if (typeof texto !== "string") {
        throw new Error("groq não retornou conteúdo de texto");
      }
      return texto;
    },
  };
}
