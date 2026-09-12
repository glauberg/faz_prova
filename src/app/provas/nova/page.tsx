"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SeletorQuestoesBanco } from "../../_components/SeletorQuestoesBanco.tsx";
import styles from "../provas.module.css";

export default function NovaProvaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [questaoBancoIds, setQuestaoBancoIds] = useState<string[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch("/api/provas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, questaoBancoIds }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível criar a prova.");
        return;
      }

      router.push(`/provas/${dados.id}`);
    } catch {
      setErro("Erro de conexão ao tentar criar a prova.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Criar Nova Prova</h1>
          <p className={styles.subtitle}>
            Informe o título e selecione as questões no banco para montar a avaliação.
          </p>
        </div>

        <Link href="/provas" className={styles.secondaryBtn}>
          &larr; Voltar para Provas
        </Link>
      </header>

      <form className={styles.formCard} onSubmit={enviar}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="titulo-prova">
            Título da Prova
          </label>
          <input
            id="titulo-prova"
            type="text"
            className={styles.formInput}
            placeholder="Ex: Prova Mensal de Matemática - 1º Bimestre"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            required
            disabled={enviando}
          />
        </div>

        <SeletorQuestoesBanco selecionadas={questaoBancoIds} onChange={setQuestaoBancoIds} />

        {erro && (
          <div className="erro" role="alert">
            {erro}
          </div>
        )}

        <div className={styles.formFooter}>
          <Link href="/provas" className={styles.secondaryBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={enviando || questaoBancoIds.length === 0}
          >
            {enviando ? "Salvando Prova..." : "Salvar Prova"}
          </button>
        </div>
      </form>
    </main>
  );
}
