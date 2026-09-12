"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SeletorQuestoesBanco } from "../../../_components/SeletorQuestoesBanco.tsx";

export default function EditarProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [questaoBancoIds, setQuestaoBancoIds] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
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
        setTitulo(dados.titulo);
        setQuestaoBancoIds(
          (dados.questaoBancoIds ?? []).filter(
            (bancoId: string | null): bancoId is string => bancoId !== null,
          ),
        );
      })
      .catch(() => setErro("erro ao carregar a prova"))
      .finally(() => setCarregando(false));
  }, [id]);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch(`/api/provas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, questaoBancoIds }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível salvar as alterações");
        return;
      }

      router.push(`/provas/${id}`);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Editar prova</h1>
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
          {enviando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </main>
  );
}
