"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../../domain/prova.ts";
import styles from "../../provas.module.css";

export default function ExportarProvaPage() {
  const { id } = useParams<{ id: string }>();
  const [prova, setProva] = useState<Prova | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [incluirGabarito, setIncluirGabarito] = useState(false);
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

  if (erro) {
    return (
      <main className={styles.container}>
        <div className="erro" role="alert">
          {erro}
        </div>
        <div className="no-imprimir">
          <Link href={`/provas/${id}`} className={styles.secondaryBtn}>
            &larr; Voltar para Prova
          </Link>
        </div>
      </main>
    );
  }

  if (carregando || !prova) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>Carregando visualização para impressão...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={`${styles.header} no-imprimir`}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Exportar Prova para PDF</h1>
          <p className={styles.subtitle}>
            Configure a inclusão de gabarito e use o diálogo do navegador para salvar como PDF.
          </p>
        </div>

        <div className={styles.cardActions}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={incluirGabarito}
              onChange={(evento) => setIncluirGabarito(evento.target.checked)}
              style={{ width: "1.1rem", height: "1.1rem", cursor: "pointer" }}
            />
            Incluir Gabarito na Impressão
          </label>

          <button type="button" className={styles.primaryBtn} onClick={() => window.print()}>
            🖨️ Imprimir / Salvar PDF
          </button>

          <Link href={`/provas/${id}`} className={styles.secondaryBtn}>
            &larr; Voltar
          </Link>
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
                <span className={styles.questaoNumber}>Questão #{indice + 1}</span>
              </div>

              <p className={styles.questaoEnunciadoDoc}>{questao.enunciado}</p>

              {(questao.tipo === "multipla-escolha" || questao.tipo === "resposta-unica") && (
                <ol className={styles.alternativasList}>
                  {questao.alternativas.map((alternativa) => (
                    <li key={alternativa}>{alternativa}</li>
                  ))}
                </ol>
              )}

              {questao.tipo === "dicotomica" && (
                <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.95rem" }}>
                  ( &nbsp; ) Verdadeiro &nbsp;&nbsp;&nbsp;&nbsp; ( &nbsp; ) Falso
                </p>
              )}

              {incluirGabarito && questao.tipo !== "discursiva" && (
                <div className={styles.gabaritoBox}>
                  <strong>Gabarito:</strong>{" "}
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
