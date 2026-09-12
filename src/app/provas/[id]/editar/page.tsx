"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SeletorQuestoesBanco } from "../../../_components/SeletorQuestoesBanco.tsx";
import styles from "../../provas.module.css";

export default function EditarProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [questaoBancoIds, setQuestaoBancoIds] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    fetch(`/api/provas/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar a prova");
          return;
        }
        setTitulo(dados.titulo);
        setQuestaoBancoIds(
          (dados.questaoBancoIds ?? []).filter(
            (bancoId: string | null): bancoId is string => bancoId !== null,
          ),
        );
      })
      .catch(() => setErro("erro ao carregar a prova"))
      .finally(() => setCarregando(false));
  }, [id]);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const resposta = await fetch(`/api/provas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, questaoBancoIds }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Não foi possível salvar as alterações.");
        return;
      }

      router.push(`/provas/${id}`);
    } catch {
      setErro("Erro de conexão ao tentar atualizar a prova.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>Carregando dados da prova...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Editar Prova</h1>
          <p className={styles.subtitle}>
            Altere o título ou a seleção de questões desta avaliação.
          </p>
        </div>

        <Link href={`/provas/${id}`} className={styles.secondaryBtn}>
          &larr; Voltar para Prova
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
          <Link href={`/provas/${id}`} className={styles.secondaryBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.primaryBtn}
            disabled={enviando || questaoBancoIds.length === 0}
          >
            {enviando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </main>
  );
}
