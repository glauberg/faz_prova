"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SeletorQuestoesBanco } from "../../_components/SeletorQuestoesBanco.tsx";

export default function NovaProvaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [questaoBancoIds, setQuestaoBancoIds] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch("/api/provas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, questaoBancoIds }),
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

        <SeletorQuestoesBanco selecionadas={questaoBancoIds} onChange={setQuestaoBancoIds} />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando || questaoBancoIds.length === 0}>
          {enviando ? "Salvando..." : "Salvar prova"}
        </button>
      </form>
    </main>
  );
}
