"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../domain/prova.ts";
import styles from "../provas.module.css";

export default function VerProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prova, setProva] = useState<Prova | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setCarregando(true);
    fetch(`/api/provas/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar a prova");
          return;
        }
        setProva(dados);
      })
      .catch(() => setErro("erro ao carregar a prova"))
      .finally(() => setCarregando(false));
  }, [id]);

  async function excluir() {
    if (!confirm("Tem certeza que deseja excluir esta prova? Esta ação não pode ser desfeita.")) {
      return;
    }
    await fetch(`/api/provas/${id}`, { method: "DELETE" });
    router.push("/provas");
  }

  if (erro) {
    return (
      <main className={styles.container}>
        <div className="erro" role="alert">
          {erro}
        </div>
        <div>
          <Link href="/provas" className={styles.secondaryBtn}>
            &larr; Voltar para Provas
          </Link>
        </div>
      </main>
    );
  }

  if (carregando || !prova) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>Carregando prova...</div>
      </main>
    );
  }

  const formatTipoNome = (tipo: string) => {
    switch (tipo) {
      case "multipla-escolha":
        return "Múltipla Escolha";
      case "resposta-unica":
        return "Resposta Única";
      case "dicotomica":
        return "Dicotômica (V/F)";
      case "discursiva":
        return "Discursiva";
      default:
        return tipo;
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>{prova.titulo}</h1>
          <p className={styles.subtitle}>
            {prova.questoes.length} {prova.questoes.length === 1 ? "questão" : "questões"} no total
          </p>
        </div>

        <div className={styles.cardActions}>
          <Link href={`/provas/${id}/corrigir`} className={styles.primaryBtn}>
            Corrigir Tentativa
          </Link>
          <Link href={`/provas/${id}/exportar`} className={styles.secondaryBtn}>
            Exportar PDF
          </Link>
          <Link href={`/provas/${id}/editar`} className={styles.secondaryBtn}>
            Editar
          </Link>
          <button type="button" className={styles.dangerBtn} onClick={excluir}>
            Excluir Prova
          </button>
        </div>
      </header>

      <article className={styles.provaDocument}>
        <div className={styles.documentHeader}>
          <h2 className={styles.documentTitle}>{prova.titulo}</h2>
          <span className={styles.badgeQuestoes}>{prova.questoes.length} questões</span>
        </div>

        <ol className={styles.questaoListDoc}>
          {prova.questoes.map((questao, indice) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lista somente leitura
            <li key={indice} className={styles.questaoDocCard}>
              <div className={styles.questaoDocHeader}>
                <span className={styles.questaoNumber}>#{indice + 1}</span>
                <span className={styles.badgeQuestoes}>{formatTipoNome(questao.tipo)}</span>
              </div>

              <p className={styles.questaoEnunciadoDoc}>{questao.enunciado}</p>

              {(questao.tipo === "multipla-escolha" || questao.tipo === "resposta-unica") && (
                <ol className={styles.alternativasList}>
                  {questao.alternativas.map((alt) => (
                    <li key={alt}>{alt}</li>
                  ))}
                </ol>
              )}

              {questao.tipo === "dicotomica" && (
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem" }}>
                  ( &nbsp; ) Verdadeiro &nbsp;&nbsp;&nbsp; ( &nbsp; ) Falso
                </p>
              )}

              {questao.tipo !== "discursiva" && (
                <div className={styles.gabaritoBox}>
                  <strong>Gabarito do Professor:</strong>{" "}
                  {questao.tipo === "dicotomica"
                    ? questao.gabarito
                      ? "Verdadeiro"
                      : "Falso"
                    : questao.tipo === "multipla-escolha"
                      ? questao.gabarito.join(", ")
                      : questao.gabarito}
                </div>
              )}
            </li>
          ))}
        </ol>
      </article>
    </main>
  );
}
