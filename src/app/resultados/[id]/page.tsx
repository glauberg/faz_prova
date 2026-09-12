"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ResultadoProva } from "../../../domain/resposta.ts";
import styles from "./resultados.module.css";

const ROTULO_STATUS: Record<string, string> = {
  acertou: "Acertou",
  errou: "Errou",
  pendente: "Pendente de correção manual",
};

export default function VerResultadoPage() {
  const { id } = useParams<{ id: string }>();
  const [resultado, setResultado] = useState<ResultadoProva | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "acertou" | "errou" | "pendente">(
    "todos",
  );

  useEffect(() => {
    setCarregando(true);
    fetch(`/api/resultados/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar o resultado");
          return;
        }
        setResultado(dados);
      })
      .catch(() => setErro("erro ao carregar o resultado"))
      .finally(() => setCarregando(false));
  }, [id]);

  if (erro) {
    return (
      <main className={styles.container}>
        <div className="erro" role="alert">
          {erro}
        </div>
        <div>
          <Link href="/provas" className={styles.secondaryBtn}>
            &larr; Voltar para Lista de Provas
          </Link>
        </div>
      </main>
    );
  }

  if (carregando || !resultado) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>Carregando resultado da correção...</div>
      </main>
    );
  }

  const acertos = resultado.acertosObjetivas;
  const totalObjetivas = resultado.totalObjetivas;
  const erros = Math.max(0, totalObjetivas - acertos);
  const pendentes = resultado.detalhamento.filter((q) => q.status === "pendente").length;
  const percentual = totalObjetivas > 0 ? Math.round((acertos / totalObjetivas) * 100) : 0;

  const alunoId = resultado.alunoId ?? "Aluno";
  const provaTitulo = resultado.provaTitulo ?? "Prova";
  const dataFormatada = resultado.createdAt
    ? new Date(resultado.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const getDesempenhoBannerClass = () => {
    if (percentual >= 90) return styles.bannerExcelente;
    if (percentual >= 70) return styles.bannerBom;
    if (percentual >= 50) return styles.bannerRegular;
    return styles.bannerAtencao;
  };

  const getDesempenhoRotulo = () => {
    if (percentual >= 90) return "🌟 Desempenho Excelente";
    if (percentual >= 70) return "👍 Bom Desempenho";
    if (percentual >= 50) return "⚠️ Desempenho Regular";
    return "❌ Precisa de Atenção";
  };

  const detalhamentoFiltrado = resultado.detalhamento.filter((item) => {
    if (filtroStatus === "todos") return true;
    return item.status === filtroStatus;
  });

  return (
    <main className={styles.container}>
      {/* Header Principal */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Resultado da Correção</h1>
          <p className={styles.subtitle}>
            Relatório de desempenho individual e detalhamento das questões.
          </p>
        </div>

        <div className={`${styles.headerActions} ${styles.noPrint}`}>
          <button type="button" className={styles.secondaryBtn} onClick={() => window.print()}>
            🖨️ Imprimir / PDF
          </button>
          {resultado.provaId && (
            <Link href={`/provas/${resultado.provaId}/corrigir`} className={styles.primaryBtn}>
              🎯 Corrigir Outro Aluno
            </Link>
          )}
        </div>
      </header>

      {/* Card Hero de Resumo */}
      <section className={styles.heroCard}>
        <div className={styles.metaHeader}>
          <div className={styles.studentInfo}>
            <h2 className={styles.studentName}>👤 {alunoId}</h2>
            <p className={styles.examTitle}>📋 Prova: {provaTitulo}</p>
          </div>
          {dataFormatada && <span className={styles.dateBadge}>🗓️ {dataFormatada}</span>}
        </div>

        {/* Banner com pontuação e nota visual */}
        <div className={`${styles.performanceBanner} ${getDesempenhoBannerClass()}`}>
          <div className={styles.scoreGroup}>
            <span className={styles.scorePercentage}>{percentual}%</span>
            <span className={styles.scoreLabel}>
              ({acertos} de {totalObjetivas} objetivas corretas)
            </span>
          </div>
          <span className={styles.performanceBadge}>{getDesempenhoRotulo()}</span>
        </div>

        {/* Barra de Progresso */}
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{
              width: `${percentual}%`,
              backgroundColor:
                percentual >= 70 ? "#22c55e" : percentual >= 50 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>

        {/* Métricas Resumidas */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricValue} style={{ color: "#166534" }}>
              {acertos}
            </span>
            <span className={styles.metricLabel}>Acertos Objetivas</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricValue} style={{ color: "#991b1b" }}>
              {erros}
            </span>
            <span className={styles.metricLabel}>Erros Objetivas</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricValue} style={{ color: "#b45309" }}>
              {pendentes}
            </span>
            <span className={styles.metricLabel}>Discursivas / Pendentes</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricValue}>{resultado.detalhamento.length}</span>
            <span className={styles.metricLabel}>Total de Questões</span>
          </div>
        </div>
      </section>

      {/* Detalhamento por Questão */}
      <section className={styles.heroCard}>
        <div className={styles.header}>
          <h2 className={styles.title} style={{ fontSize: "1.25rem" }}>
            Detalhamento por Questão
          </h2>

          <div className={styles.filterTabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${filtroStatus === "todos" ? styles.tabBtnActive : ""}`}
              onClick={() => setFiltroStatus("todos")}
            >
              Todas ({resultado.detalhamento.length})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${filtroStatus === "acertou" ? styles.tabBtnActive : ""}`}
              onClick={() => setFiltroStatus("acertou")}
            >
              ✓ Acertos ({acertos})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${filtroStatus === "errou" ? styles.tabBtnActive : ""}`}
              onClick={() => setFiltroStatus("errou")}
            >
              ✕ Erros ({erros})
            </button>
            {pendentes > 0 && (
              <button
                type="button"
                className={`${styles.tabBtn} ${filtroStatus === "pendente" ? styles.tabBtnActive : ""}`}
                onClick={() => setFiltroStatus("pendente")}
              >
                ⏳ Pendentes ({pendentes})
              </button>
            )}
          </div>
        </div>

        <div className={styles.detalhamentoGrid}>
          {detalhamentoFiltrado.length === 0 ? (
            <div className={styles.emptyState}>Nenhuma questão encontrada para este filtro.</div>
          ) : (
            detalhamentoFiltrado.map((item) => {
              const isAcertou = item.status === "acertou";
              const isErrou = item.status === "errou";

              const statusClass = isAcertou
                ? styles.statusAcertou
                : isErrou
                  ? styles.statusErrou
                  : styles.statusPendente;

              const statusIcon = isAcertou ? "✓" : isErrou ? "✕" : "⏳";

              return (
                <div key={item.questaoIndice} className={styles.questaoResultCard}>
                  <div className={styles.questaoInfo}>
                    <span className={styles.questaoIndexBadge}>
                      #{String(item.questaoIndice + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.questaoTitleText}>Questão {item.questaoIndice + 1}</h3>
                  </div>

                  <span className={`${styles.statusPill} ${statusClass}`}>
                    {statusIcon} {ROTULO_STATUS[item.status]}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Footer com Links de Navegação */}
      <footer
        className={`${styles.headerActions} ${styles.noPrint}`}
        style={{ justifyContent: "center", marginTop: "1rem" }}
      >
        {resultado.provaId && (
          <Link href={`/provas/${resultado.provaId}`} className={styles.secondaryBtn}>
            &larr; Voltar para a Prova
          </Link>
        )}
        <Link href="/provas" className={styles.secondaryBtn}>
          📋 Ver Todas as Provas
        </Link>
      </footer>
    </main>
  );
}
