"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
}

export default function ListaProvasPage() {
  const [provas, setProvas] = useState<ProvaResumo[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  function carregar() {
    fetch("/api/provas")
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar provas");
          return;
        }
        setProvas(dados.provas ?? []);
      })
      .catch(() => setErro("erro ao carregar provas"));
  }

  useEffect(carregar, []);

  async function excluir(id: string) {
    await fetch(`/api/provas/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <main>
      <h1>Provas</h1>
      <p>
        <Link href="/provas/nova">Criar nova prova</Link>
      </p>

      {erro && <p className="erro">{erro}</p>}

      <ul>
        {provas.map((prova) => (
          <li key={prova.id}>
            <Link href={`/provas/${prova.id}`}>{prova.titulo}</Link> ({prova.quantidadeQuestoes}{" "}
            questões) <Link href={`/provas/${prova.id}/editar`}>Editar</Link>{" "}
            <button type="button" onClick={() => excluir(prova.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
