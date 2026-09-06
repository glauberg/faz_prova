"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestaoCampos } from "../../_components/QuestaoCampos.tsx";
import {
  novaQuestaoRascunho,
  paraQuestaoDominio,
  type QuestaoRascunho,
} from "../../_components/questaoRascunho.ts";

export default function NovaProvaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [questoes, setQuestoes] = useState<QuestaoRascunho[]>([novaQuestaoRascunho()]);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function atualizarQuestao(indice: number, questao: QuestaoRascunho) {
    setQuestoes((atual) => atual.map((q, i) => (i === indice ? questao : q)));
  }

  function removerQuestao(indice: number) {
    setQuestoes((atual) => atual.filter((_, i) => i !== indice));
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch("/api/provas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, questoes: questoes.map(paraQuestaoDominio) }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível criar a prova");
        return;
      }

      router.push(`/provas/${dados.id}`);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Criar prova</h1>
      <form onSubmit={enviar}>
        <label>
          Título
          <input
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            required
          />
        </label>

        {questoes.map((questao, indice) => (
          <QuestaoCampos
            // biome-ignore lint/suspicious/noArrayIndexKey: a lista é reordenada só por remoção, nunca por arraste
            key={indice}
            indice={indice}
            questao={questao}
            onChange={(atualizada) => atualizarQuestao(indice, atualizada)}
            onRemover={() => removerQuestao(indice)}
          />
        ))}

        <button
          type="button"
          onClick={() => setQuestoes((atual) => [...atual, novaQuestaoRascunho()])}
        >
          Adicionar questão
        </button>

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando || questoes.length === 0}>
          {enviando ? "Salvando..." : "Salvar prova"}
        </button>
      </form>
    </main>
  );
}
