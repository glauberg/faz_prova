"use client";

import { useEffect, useState } from "react";
import type { QuestaoBancoSalva } from "../../domain/questaoBanco.ts";
import styles from "./SeletorQuestoesBanco.module.css";

interface SeletorQuestoesBancoProps {
  selecionadas: string[];
  onChange: (ids: string[]) => void;
}

export function SeletorQuestoesBanco({ selecionadas, onChange }: SeletorQuestoesBancoProps) {
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [filtroTema, setFiltroTema] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    fetch("/api/questoes")
      .then(async (resposta) => {
        const dados = await resposta.json();
        setQuestoes(resposta.ok ? (dados.questoes ?? []) : []);
      })
      .catch(() => setQuestoes([]));
  }, []);

  function alternar(id: string) {
    if (selecionadas.includes(id)) {
      onChange(selecionadas.filter((atual) => atual !== id));
    } else {
      onChange([...selecionadas, id]);
    }
  }

  function mover(indice: number, direcao: -1 | 1) {
    const alvo = indice + direcao;
    if (alvo < 0 || alvo >= selecionadas.length) {
      return;
    }
    const novaOrdem = [...selecionadas];
    const temp = novaOrdem[indice];
    novaOrdem[indice] = novaOrdem[alvo] as string;
    novaOrdem[alvo] = temp as string;
    onChange(novaOrdem);
  }

  const questoesPorId = new Map(questoes.map((questao) => [questao.id, questao]));
  const disponiveis = questoes.filter(
    (questao) =>
      (!filtroTema.trim() ||
        questao.tema.toLowerCase().includes(filtroTema.trim().toLowerCase())) &&
      (!filtroTipo || questao.questao.tipo === filtroTipo),
  );

  const getTipoBadgeClass = (tipo: string) => {
    switch (tipo) {
      case "multipla-escolha":
        return styles.tipoMultipla;
      case "resposta-unica":
        return styles.tipoUnica;
      case "dicotomica":
        return styles.tipoDicotomica;
      case "discursiva":
        return styles.tipoDiscursiva;
      default:
        return "";
    }
  };

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
    <fieldset className={styles.container}>
      <legend className={styles.legend}>
        <span>📚</span> Seleção de Questões do Banco
      </legend>

      <div className={styles.filtersRow}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="filtro-tema">
            Filtrar por Tema
          </label>
          <input
            id="filtro-tema"
            type="text"
            className={styles.input}
            placeholder="Digite um tema..."
            value={filtroTema}
            onChange={(evento) => setFiltroTema(evento.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="filtro-tipo">
            Filtrar por Tipo
          </label>
          <select
            id="filtro-tipo"
            className={styles.select}
            value={filtroTipo}
            onChange={(evento) => setFiltroTipo(evento.target.value)}
          >
            <option value="">Todos os tipos</option>
            <option value="discursiva">Discursiva</option>
            <option value="multipla-escolha">Múltipla escolha</option>
            <option value="dicotomica">Dicotômica (V/F)</option>
            <option value="resposta-unica">Resposta única</option>
          </select>
        </div>
      </div>

      <div className={styles.panelsGrid}>
        {/* Painel Esquerdo: Disponíveis */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Questões Disponíveis</h3>
            <span className={styles.countBadge}>{disponiveis.length}</span>
          </div>

          {disponiveis.length === 0 ? (
            <div className={styles.emptyState}>Nenhuma questão encontrada para os filtros.</div>
          ) : (
            <ul className={styles.itemList}>
              {disponiveis.map((questao) => {
                const jaSelecionada = selecionadas.includes(questao.id);
                return (
                  <li key={questao.id} className={styles.itemCard}>
                    <div className={styles.itemHeader}>
                      <span
                        className={`${styles.tipoBadge} ${getTipoBadgeClass(questao.questao.tipo)}`}
                      >
                        {formatTipoNome(questao.questao.tipo)}
                      </span>
                      <span className={styles.temaTag}>{questao.tema}</span>
                    </div>

                    <p className={styles.itemText}>{questao.questao.enunciado}</p>

                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={jaSelecionada ? styles.btnRemove : styles.btnAdd}
                        onClick={() => alternar(questao.id)}
                      >
                        {jaSelecionada ? "✓ Remover da Prova" : "+ Adicionar à Prova"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Painel Direito: Selecionadas na Prova */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Questões Selecionadas na Prova</h3>
            <span className={styles.countBadge}>{selecionadas.length}</span>
          </div>

          {selecionadas.length === 0 ? (
            <div className={styles.emptyState}>
              Nenhuma questão selecionada ainda. Clique em &quot;+ Adicionar à Prova&quot; no painel
              ao lado.
            </div>
          ) : (
            <ol className={styles.itemList}>
              {selecionadas.map((id, indice) => {
                const questao = questoesPorId.get(id);
                return (
                  <li key={id} className={styles.itemCard}>
                    {questao ? (
                      <>
                        <div className={styles.itemHeader}>
                          <span
                            className={`${styles.tipoBadge} ${getTipoBadgeClass(
                              questao.questao.tipo,
                            )}`}
                          >
                            #{indice + 1} • {formatTipoNome(questao.questao.tipo)}
                          </span>
                          <span className={styles.temaTag}>{questao.tema}</span>
                        </div>
                        <p className={styles.itemText}>{questao.questao.enunciado}</p>
                      </>
                    ) : (
                      <p className={styles.itemText}>
                        Questão #{indice + 1} (ID: {id})
                      </p>
                    )}

                    <div className={styles.itemActions}>
                      <button
                        type="button"
                        className={styles.btnMove}
                        onClick={() => mover(indice, -1)}
                        disabled={indice === 0}
                        title="Mover para cima"
                        aria-label="Mover para cima"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        className={styles.btnMove}
                        onClick={() => mover(indice, 1)}
                        disabled={indice === selecionadas.length - 1}
                        title="Mover para baixo"
                        aria-label="Mover para baixo"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        className={styles.btnRemove}
                        onClick={() => alternar(id)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </fieldset>
  );
}
