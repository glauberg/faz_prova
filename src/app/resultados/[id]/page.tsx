"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ResultadoProva } from "../../../domain/resposta.ts";

const ROTULO_STATUS: Record<string, string> = {
  acertou: "Acertou",
  errou: "Errou",
  pendente: "Pendente de correção manual",
};

export default function VerResultadoPage() {
  const { id } = useParams<{ id: string }>();
  const [resultado, setResultado] = useState<ResultadoProva | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/resultados/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar o resultado");
          return;
        }
        setResultado(dados);
      })
      .catch(() => setErro("erro ao carregar o resultado"));
  }, [id]);

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  if (!resultado) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <h1>Resultado</h1>
      <p>
        {resultado.acertosObjetivas} acertos de {resultado.totalObjetivas} questões objetivas
      </p>
      <ol>
        {resultado.detalhamento.map((item) => (
          <li key={item.questaoIndice}>
            Questão {item.questaoIndice + 1}: {ROTULO_STATUS[item.status]}
          </li>
        ))}
      </ol>
    </main>
  );
}
