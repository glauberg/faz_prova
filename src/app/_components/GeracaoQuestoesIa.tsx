"use client";

import { useState } from "react";
import type { Questao } from "../../domain/questao.ts";
import type { QuestaoBancoSalva } from "../../domain/questaoBanco.ts";
import styles from "./GeracaoQuestoesIa.module.css";

interface QuantidadesRascunho {
  discursiva: number;
  "multipla-escolha": number;
  dicotomica: number;
  "resposta-unica": number;
}

const CAMPOS_QUANTIDADE: { tipo: Questao["tipo"]; rotulo: string }[] = [
  { tipo: "discursiva", rotulo: "Discursivas" },
  { tipo: "multipla-escolha", rotulo: "Múltipla Escolha" },
  { tipo: "dicotomica", rotulo: "Dicotômicas (V/F)" },
  { tipo: "resposta-unica", rotulo: "Resposta Única" },
];

function quantidadesVazias(): QuantidadesRascunho {
  return { discursiva: 0, "multipla-escolha": 0, dicotomica: 0, "resposta-unica": 0 };
}

interface GeracaoQuestoesIaProps {
  onQuestoesGeradas: (questoes: QuestaoBancoSalva[]) => void;
}

export function GeracaoQuestoesIa({ onQuestoesGeradas }: GeracaoQuestoesIaProps) {
  const [tema, setTema] = useState("");
  const [referenciaBibliografica, setReferenciaBibliografica] = useState("");
  const [quantidades, setQuantidades] = useState<QuantidadesRascunho>(quantidadesVazias());
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function gerar() {
    setErro(null);
    setGerando(true);

    try {
      const resposta = await fetch("/api/questoes/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tema, referenciaBibliografica, quantidades }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível gerar as questões");
        return;
      }

      onQuestoesGeradas(dados.questoes as QuestaoBancoSalva[]);
      setTema("");
      setReferenciaBibliografica("");
      setQuantidades(quantidadesVazias());
    } catch {
      setErro("Erro de conexão com o serviço de IA.");
    } finally {
      setGerando(false);
    }
  }

  const totalQuantidade = Object.values(quantidades).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.cardIa}>
      <header className={styles.headerIa}>
        <div className={styles.iconIa}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div>
          <h2 className={styles.titleIa}>Gerar Questões Automatizadas com IA</h2>
          <p className={styles.subtitleIa}>
            O carrossel de LLMs elabora questões e insere direto no seu banco.
          </p>
        </div>
      </header>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="ia-tema">
            Tema da Questão
          </label>
          <input
            id="ia-tema"
            type="text"
            className={styles.input}
            placeholder="Ex: Equações do 2º Grau ou Sintaxe da Língua Portuguesa"
            value={tema}
            onChange={(evento) => setTema(evento.target.value)}
            disabled={gerando}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="ia-ref">
            Referência Bibliográfica / Livro-texto
          </label>
          <textarea
            id="ia-ref"
            className={styles.textarea}
            placeholder="Ex: Capítulo 4 - Livro de Matemática Fundamental, Autor X..."
            value={referenciaBibliografica}
            onChange={(evento) => setReferenciaBibliografica(evento.target.value)}
            disabled={gerando}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.label}>Quantidades por Tipo de Questão</span>
        <div className={styles.quantidadesGrid}>
          {CAMPOS_QUANTIDADE.map(({ tipo, rotulo }) => (
            <div key={tipo} className={styles.inputGroup}>
              <label className={styles.label} htmlFor={`ia-qtd-${tipo}`}>
                {rotulo}
              </label>
              <input
                id={`ia-qtd-${tipo}`}
                type="number"
                min={0}
                className={styles.inputNumber}
                value={quantidades[tipo]}
                onChange={(evento) =>
                  setQuantidades((atual) => ({
                    ...atual,
                    [tipo]: Number(evento.target.value) || 0,
                  }))
                }
                disabled={gerando}
              />
            </div>
          ))}
        </div>
      </div>

      {erro && (
        <div className={styles.erroBox} role="alert">
          {erro}
        </div>
      )}

      <button
        type="button"
        className={styles.btnGerar}
        onClick={gerar}
        disabled={
          gerando || !tema.trim() || !referenciaBibliografica.trim() || totalQuantidade === 0
        }
      >
        {gerando ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            <span>Gerando Questões com IA...</span>
          </>
        ) : (
          <span>✨ Gerar {totalQuantidade > 0 ? `${totalQuantidade} ` : ""}Questão(ões)</span>
        )}
      </button>
    </div>
  );
}
