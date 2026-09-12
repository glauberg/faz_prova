"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../../domain/prova.ts";
import type { RespostaAluno } from "../../../../domain/resposta.ts";
import { RespostaCampos } from "../../../_components/RespostaCampos.tsx";
import styles from "../../provas.module.css";

export default function CorrigirProvaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [prova, setProva] = useState<Prova | null>(null);
  const [alunoId, setAlunoId] = useState("");
  const [respostas, setRespostas] = useState<Map<number, string | boolean | string[]>>(new Map());
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
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

  function definirResposta(indice: number, valor: string | boolean | string[]) {
    setRespostas((atual) => new Map(atual).set(indice, valor));
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    const listaRespostas: RespostaAluno[] = Array.from(respostas.entries()).map(
      ([questaoIndice, valor]) => ({ questaoIndice, valor }),
    );

    try {
      const resposta = await fetch(`/api/provas/${id}/correcoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alunoId, respostas: listaRespostas }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível corrigir a prova");
        return;
      }

      router.push(`/resultados/${dados.id}`);
    } catch {
      setErro("Erro de conexão ao tentar processar a correção.");
    } finally {
      setEnviando(false);
    }
  }

  if (erro && !prova) {
    return (
      <main className={styles.container}>
        <div className="erro" role="alert">
          {erro}
        </div>
        <div>
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
        <div className={styles.emptyState}>Carregando formulário de correção...</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Corrigir Prova: {prova.titulo}</h1>
          <p className={styles.subtitle}>
            Informe o identificador do aluno e insira as respostas fornecidas.
          </p>
        </div>

        <Link href={`/provas/${id}`} className={styles.secondaryBtn}>
          &larr; Voltar para Prova
        </Link>
      </header>

      <form className={styles.formCard} onSubmit={enviar}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="aluno-id">
            Identificador ou Nome do Aluno
          </label>
          <input
            id="aluno-id"
            type="text"
            className={styles.formInput}
            placeholder="Ex: João da Silva (Matrícula 1234)"
            value={alunoId}
            onChange={(evento) => setAlunoId(evento.target.value)}
            required
            disabled={enviando}
          />
        </div>

        <div className={styles.formGroup}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0.5rem 0 0 0" }}>
            Respostas do Aluno ({prova.questoes.length} questões)
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {prova.questoes.map((questao, indice) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: lista somente leitura de questões
              <div key={indice} className={styles.questaoDocCard}>
                <RespostaCampos
                  indice={indice}
                  questao={questao}
                  valor={respostas.get(indice)}
                  onChange={(valor) => definirResposta(indice, valor)}
                />
              </div>
            ))}
          </div>
        </div>

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
            disabled={enviando || !alunoId.trim()}
          >
            {enviando ? "Processando Correção..." : "Finalizar Correção"}
          </button>
        </div>
      </form>
    </main>
  );
}
