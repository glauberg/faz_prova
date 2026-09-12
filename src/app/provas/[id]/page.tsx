"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../domain/prova.ts";

export default function VerProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prova, setProva] = useState<Prova | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

  async function excluir() {
    await fetch(`/api/provas/${id}`, { method: "DELETE" });
    router.push("/provas");
  }

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  if (!prova) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>{prova.titulo}</h1>
      <ol>
        {prova.questoes.map((questao, indice) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: lista somente leitura, ordem vem do servidor
          <li key={indice}>
            <strong>[{questao.tipo}]</strong> {questao.enunciado}
          </li>
        ))}
      </ol>
      <p>
        <Link href={`/provas/${id}/corrigir`}>Corrigir uma tentativa</Link>
      </p>
      <p>
        <Link href={`/provas/${id}/editar`}>Editar prova</Link>{" "}
        <button type="button" onClick={excluir}>
          Excluir prova
        </button>
      </p>
    </main>
  );
}
