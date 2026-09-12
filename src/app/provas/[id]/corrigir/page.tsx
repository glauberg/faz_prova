"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../../domain/prova.ts";
import type { RespostaAluno } from "../../../../domain/resposta.ts";
import { RespostaCampos } from "../../../_components/RespostaCampos.tsx";

export default function CorrigirProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prova, setProva] = useState<Prova | null>(null);
  const [alunoId, setAlunoId] = useState("");
  const [respostas, setRespostas] = useState<Map<number, string | boolean | string[]>>(new Map());
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch(`/api/provas/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar a prova");
          return;
        }
        setProva(dados);
      })
      .catch(() => setErro("erro ao carregar a prova"));
  }, [id]);

  function definirResposta(indice: number, valor: string | boolean | string[]) {
    setRespostas((atual) => new Map(atual).set(indice, valor));
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const listaRespostas: RespostaAluno[] = Array.from(respostas.entries()).map(
      ([questaoIndice, valor]) => ({ questaoIndice, valor }),
    );

    try {
      const resposta = await fetch(`/api/provas/${id}/correcoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId, respostas: listaRespostas }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível corrigir a prova");
        return;
      }

      router.push(`/resultados/${dados.id}`);
    } finally {
      setEnviando(false);
    }
  }

  if (erro && !prova) {
    return <p className="erro">{erro}</p>;
  }

  if (!prova) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Corrigir: {prova.titulo}</h1>
      <form onSubmit={enviar}>
        <label>
          Identificador do aluno
          <input
            type="text"
            value={alunoId}
            onChange={(evento) => setAlunoId(evento.target.value)}
            required
          />
        </label>

        {prova.questoes.map((questao, indice) => (
          <RespostaCampos
            // biome-ignore lint/suspicious/noArrayIndexKey: lista somente leitura, ordem vem do servidor
            key={indice}
            indice={indice}
            questao={questao}
            valor={respostas.get(indice)}
            onChange={(valor) => definirResposta(indice, valor)}
          />
        ))}

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Corrigindo..." : "Corrigir"}
        </button>
      </form>
    </main>
  );
}
