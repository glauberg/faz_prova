"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { QuestaoBancoSalva } from "../domain/questaoBanco.ts";

interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
}

const LIMITE_QUESTOES_EXIBIDAS = 10;

export default function HomePage() {
  const [provas, setProvas] = useState<ProvaResumo[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);

  useEffect(() => {
    fetch("/api/provas")
      .then(async (resposta) => {
        const dados = await resposta.json();
        setProvas(resposta.ok ? (dados.provas ?? []) : []);
      })
      .catch(() => setProvas([]));

    fetch("/api/questoes")
      .then(async (resposta) => {
        const dados = await resposta.json();
        setQuestoes(resposta.ok ? (dados.questoes ?? []) : []);
      })
      .catch(() => setQuestoes([]));
  }, []);

  return (
    <main>
      <h1>Gestor de Provas</h1>
      <p>Criação, correção e organização de avaliações.</p>

      <p>
        <Link href="/provas/nova">Criar uma nova prova</Link>
      </p>

      <h2>Provas ({provas.length})</h2>
      {provas.length === 0 ? (
        <p>Nenhuma prova cadastrada ainda.</p>
      ) : (
        <ul>
          {provas.map((prova) => (
            <li key={prova.id}>
              <Link href={`/provas/${prova.id}`}>{prova.titulo}</Link> ({prova.quantidadeQuestoes}{" "}
              questões)
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link href="/provas">Ver todas as provas</Link>
      </p>

      <h2>Banco de questões ({questoes.length})</h2>
      {questoes.length === 0 ? (
        <p>Nenhuma questão cadastrada ainda.</p>
      ) : (
        <ul>
          {questoes.slice(0, LIMITE_QUESTOES_EXIBIDAS).map((item) => (
            <li key={item.id}>
              <strong>[{item.questao.tipo}]</strong> {item.tema}: {item.questao.enunciado}
            </li>
          ))}
        </ul>
      )}
      {questoes.length > LIMITE_QUESTOES_EXIBIDAS && (
        <p>e mais {questoes.length - LIMITE_QUESTOES_EXIBIDAS} questão(ões)...</p>
      )}
      <p>
        <Link href="/questoes">Gerenciar banco de questões</Link>
      </p>
    </main>
  );
}
