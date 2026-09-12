"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuestaoBancoSalva } from "../domain/questaoBanco.ts";
import styles from "./dashboard.module.css";

interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
}

const LIMITE_PROVAS_EXIBIDAS = 4;

export default function HomePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string>("Professor");
  const [provas, setProvas] = useState<ProvaResumo[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        const [resAuth, resProvas, resQuestoes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/provas"),
          fetch("/api/questoes"),
        ]);

        if (resAuth.status === 401 || resProvas.status === 401 || resQuestoes.status === 401) {
          router.push("/login");
          return;
        }

        if (resAuth.ok) {
          const dadosAuth = await resAuth.json();
          if (dadosAuth.usuario) {
            setUsuario(dadosAuth.usuario);
          }
        }

        if (resProvas.ok) {
          const dadosProvas = await resProvas.json();
          setProvas(dadosProvas.provas ?? []);
        }

        if (resQuestoes.ok) {
          const dadosQuestoes = await resQuestoes.json();
          setQuestoes(dadosQuestoes.questoes ?? []);
        }
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro ao carregar dados do dashboard");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [router]);

  // Cálculos de métricas
  const totalProvas = provas.length;
  const totalQuestoes = questoes.length;
  const temasUnicos = new Set(questoes.map((q) => q.tema.trim().toLowerCase())).size;

  const questoesPorTipo = {
    "multipla-escolha": questoes.filter((q) => q.questao.tipo === "multipla-escolha").length,
    "resposta-unica": questoes.filter((q) => q.questao.tipo === "resposta-unica").length,
    dicotomica: questoes.filter((q) => q.questao.tipo === "dicotomica").length,
    discursiva: questoes.filter((q) => q.questao.tipo === "discursiva").length,
  };

  return (
    <main className={styles.dashboardContainer}>
      {/* Banner de Boas-Vindas */}
      <section className={styles.welcomeBanner}>
        <div className={styles.welcomeText}>
          <h1>Olá, {usuario}!</h1>
          <p>
            Bem-vindo ao seu painel. Gerencie avaliações, elabore questões com IA e acompanhe os
            resultados.
          </p>
        </div>
        <Link href="/provas/nova" className={styles.bannerAction}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Criar Nova Prova</span>
        </Link>
      </section>

      {erro && (
        <div className="erro" role="alert">
          {erro}
        </div>
      )}

      {/* Grid de Métricas (KPIs) */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconBlue}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{carregando ? "-" : totalProvas}</span>
            <span className={styles.metricLabel}>Provas Cadastradas</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconGreen}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{carregando ? "-" : totalQuestoes}</span>
            <span className={styles.metricLabel}>Questões no Banco</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconPurple}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{carregando ? "-" : temasUnicos}</span>
            <span className={styles.metricLabel}>Temas Diferentes</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={`${styles.metricIcon} ${styles.metricIconAmber}`}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>
              {carregando
                ? "-"
                : questoesPorTipo["multipla-escolha"] +
                  questoesPorTipo["resposta-unica"] +
                  questoesPorTipo.dicotomica}
            </span>
            <span className={styles.metricLabel}>Objetivas Corrigíveis</span>
          </div>
        </div>
      </section>

      {/* Provas Recentes */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Provas Recentes
          </h2>
          <Link href="/provas" className={styles.seeAllLink}>
            Ver todas as provas ({totalProvas}) &rarr;
          </Link>
        </div>

        {carregando ? (
          <div className={styles.emptyState}>Carregando provas...</div>
        ) : provas.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma prova cadastrada no momento.</p>
            <Link href="/provas/nova" className={styles.actionBtnPrimary}>
              Criar Primeira Prova
            </Link>
          </div>
        ) : (
          <div className={styles.provasGrid}>
            {provas.slice(0, LIMITE_PROVAS_EXIBIDAS).map((prova) => (
              <div key={prova.id} className={styles.provaCard}>
                <div>
                  <div className={styles.provaHeader}>
                    <div className={styles.provaTitleGroup}>
                      <div className={styles.provaIcon}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3 className={styles.provaTitle}>{prova.titulo}</h3>
                    </div>
                    <span className={styles.provaBadge}>
                      {prova.quantidadeQuestoes}{" "}
                      {prova.quantidadeQuestoes === 1 ? "questão" : "questões"}
                    </span>
                  </div>
                </div>

                <div className={styles.provaActions}>
                  <Link
                    href={`/provas/${prova.id}/corrigir`}
                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                  >
                    <span>Corrigir</span>
                  </Link>
                  <Link
                    href={`/provas/${prova.id}`}
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  >
                    <span>Ver</span>
                  </Link>
                  <Link
                    href={`/provas/${prova.id}/exportar`}
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  >
                    <span>PDF</span>
                  </Link>
                  <Link
                    href={`/provas/${prova.id}/editar`}
                    className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  >
                    <span>Editar</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
