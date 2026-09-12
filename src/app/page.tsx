"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuestaoBancoSalva } from "../domain/questaoBanco.ts";

interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
}

const LIMITE_QUESTOES_EXIBIDAS = 10;

export default function HomePage() {
  const router = useRouter();
  const [provas, setProvas] = useState<ProvaResumo[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function tratarResposta<T>(resposta: Response): Promise<T | null> {
      if (resposta.status === 401) {
        router.push("/login");
        return null;
      }

      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro ?? "erro ao carregar dados");
      }
      return dados as T;
    }

    fetch("/api/provas")
      .then((resposta) => tratarResposta<{ provas: ProvaResumo[] }>(resposta))
      .then((dados) => {
        if (dados) {
          setProvas(dados.provas ?? []);
        }
      })
      .catch((erro) => setErro(erro instanceof Error ? erro.message : "erro ao carregar provas"));

    fetch("/api/questoes")
      .then((resposta) => tratarResposta<{ questoes: QuestaoBancoSalva[] }>(resposta))
      .then((dados) => {
        if (dados) {
          setQuestoes(dados.questoes ?? []);
        }
      })
      .catch((erro) =>
        setErro(erro instanceof Error ? erro.message : "erro ao carregar o banco de questões"),
      );
  }, [router]);

  return (
    <main>
      <h1>Gestor de Provas</h1>
      <p>Criação, correção e organização de avaliações.</p>

      <p>
        <Link href="/provas/nova">Criar uma nova prova</Link>
      </p>

      {erro && <p className="erro">{erro}</p>}

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
