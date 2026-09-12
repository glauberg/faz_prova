"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./provas.module.css";

interface ProvaResumo {
  id: string;
  titulo: string;
  quantidadeQuestoes: number;
}

export default function ListaProvasPage() {
  const router = useRouter();
  const [provas, setProvas] = useState<ProvaResumo[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [idExcluindo, setIdExcluindo] = useState<string | null>(null);

  function carregar() {
    setCarregando(true);
    fetch("/api/provas")
      .then(async (resposta) => {
        if (resposta.status === 401) {
          router.push("/login");
          return;
        }
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar provas");
          return;
        }
        setProvas(dados.provas ?? []);
      })
      .catch(() => setErro("erro ao carregar provas"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, [router]);

  async function excluir(id: string) {
    if (
      !confirm(
        "Tem certeza que deseja excluir esta prova? Esta ação apaga os resultados das correções.",
      )
    ) {
      return;
    }
    setIdExcluindo(id);
    try {
      await fetch(`/api/provas/${id}`, { method: "DELETE" });
      carregar();
    } finally {
      setIdExcluindo(null);
    }
  }

  const provasFiltradas = provas.filter((p) =>
    p.titulo.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Minhas Provas</h1>
          <p className={styles.subtitle}>
            Gerencie suas avaliações criadas, edite questões e acesse o gabarito.
          </p>
        </div>

        <Link href="/provas/nova" className={styles.primaryBtn}>
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
      </header>

      {erro && (
        <div className="erro" role="alert">
          {erro}
        </div>
      )}

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 Buscar prova por título..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando ? (
        <div className={styles.emptyState}>Carregando provas...</div>
      ) : provasFiltradas.length === 0 ? (
        <div className={styles.emptyState}>
          <p>
            {busca.trim()
              ? "Nenhuma prova encontrada para o filtro digitado."
              : "Nenhuma prova criada ainda."}
          </p>
          {!busca.trim() && (
            <Link href="/provas/nova" className={styles.primaryBtn}>
              Criar Primeira Prova
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.gridProvas}>
          {provasFiltradas.map((prova) => (
            <article key={prova.id} className={styles.cardProva}>
              <div className={styles.cardProvaTop}>
                <div>
                  <h2 className={styles.cardProvaTitle}>{prova.titulo}</h2>
                  <span className={styles.badgeQuestoes}>
                    {prova.quantidadeQuestoes}{" "}
                    {prova.quantidadeQuestoes === 1 ? "questão" : "questões"}
                  </span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/provas/${prova.id}/corrigir`} className={styles.primaryBtn}>
                  Corrigir
                </Link>
                <Link href={`/provas/${prova.id}`} className={styles.secondaryBtn}>
                  Ver
                </Link>

                <Link href={`/provas/${prova.id}/exportar`} className={styles.secondaryBtn}>
                  PDF
                </Link>
                <Link href={`/provas/${prova.id}/editar`} className={styles.secondaryBtn}>
                  Editar
                </Link>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => excluir(prova.id)}
                  disabled={idExcluindo === prova.id}
                >
                  {idExcluindo === prova.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
