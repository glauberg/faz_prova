"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Questao } from "../../domain/questao.ts";
import type { QuestaoBancoSalva } from "../../domain/questaoBanco.ts";
import { GeracaoQuestoesIa } from "../_components/GeracaoQuestoesIa.tsx";
import { QuestaoCampos } from "../_components/QuestaoCampos.tsx";
import {
  novaQuestaoRascunho,
  paraQuestaoDominio,
  paraQuestaoRascunho,
  type QuestaoRascunho,
} from "../_components/questaoRascunho.ts";
import styles from "./questoes.module.css";

const TIPOS: { valor: Questao["tipo"]; rotulo: string }[] = [
  { valor: "discursiva", rotulo: "Discursiva" },
  { valor: "multipla-escolha", rotulo: "Múltipla escolha" },
  { valor: "dicotomica", rotulo: "Dicotômica (V/F)" },
  { valor: "resposta-unica", rotulo: "Resposta única" },
];

export default function BancoQuestoesPage() {
  const router = useRouter();
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [filtroTema, setFiltroTema] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [tema, setTema] = useState("");
  const [rascunho, setRascunho] = useState<QuestaoRascunho>(novaQuestaoRascunho());
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  function carregar() {
    setCarregando(true);
    const parametros = new URLSearchParams();
    if (filtroTema.trim()) {
      parametros.set("tema", filtroTema.trim());
    }
    if (filtroTipo) {
      parametros.set("tipo", filtroTipo);
    }

    fetch(`/api/questoes?${parametros.toString()}`)
      .then(async (resposta) => {
        if (resposta.status === 401) {
          router.push("/login");
          return;
        }
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar o banco de questões");
          return;
        }
        setQuestoes(dados.questoes ?? []);
      })
      .catch(() => setErro("erro ao carregar o banco de questões"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, [filtroTema, filtroTipo, router]);

  function iniciarEdicao(item: QuestaoBancoSalva) {
    setEditandoId(item.id);
    setTema(item.tema);
    setRascunho(paraQuestaoRascunho(item.questao));
    window.scrollTo({ top: 400, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTema("");
    setRascunho(novaQuestaoRascunho());
  }

  async function salvar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const corpo = { tema, questao: paraQuestaoDominio(rascunho) };
      const resposta = await fetch(editandoId ? `/api/questoes/${editandoId}` : "/api/questoes", {
        method: editandoId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "não foi possível salvar a questão");
        return;
      }

      cancelarEdicao();
      carregar();
    } catch {
      setErro("Erro de conexão ao tentar salvar a questão.");
    } finally {
      setEnviando(false);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta questão do banco?")) {
      return;
    }
    await fetch(`/api/questoes/${id}`, { method: "DELETE" });
    carregar();
  }

  function adicionarGeradasPorIa(geradas: QuestaoBancoSalva[]) {
    setQuestoes((atual) => [...geradas, ...atual]);
  }

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
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Banco de Questões</h1>
          <p className={styles.subtitle}>
            Elabore questões manualmente ou utilize Inteligência Artificial para enriquecer seu
            acervo.
          </p>
        </div>
      </header>

      {/* Assistente de IA */}
      <GeracaoQuestoesIa onQuestoesGeradas={adicionarGeradasPorIa} />

      {/* Cadastro / Edição Manual */}
      <section className={styles.cardSection}>
        <h2 className={styles.sectionTitle}>
          <span>{editandoId ? "✏️" : "➕"}</span>
          <span>{editandoId ? "Editar Questão" : "Cadastrar Nova Questão Manualmente"}</span>
        </h2>

        <form
          onSubmit={salvar}
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tema-questao">
              Tema / Assunto
            </label>
            <input
              id="tema-questao"
              type="text"
              className={styles.input}
              placeholder="Ex: Português - Crase, Matemática - Frações..."
              value={tema}
              onChange={(evento) => setTema(evento.target.value)}
              required
              disabled={enviando}
            />
          </div>

          <QuestaoCampos questao={rascunho} onChange={setRascunho} />

          {erro && (
            <div className="erro" role="alert">
              {erro}
            </div>
          )}

          <div className={styles.actionsFooter}>
            {editandoId && (
              <button type="button" className={styles.secondaryBtn} onClick={cancelarEdicao}>
                Cancelar Edição
              </button>
            )}
            <button type="submit" className={styles.primaryBtn} disabled={enviando || !tema.trim()}>
              {enviando ? "Salvando..." : editandoId ? "Salvar Alterações" : "Salvar no Banco"}
            </button>
          </div>
        </form>
      </section>

      {/* Filtros e Lista de Questões Cadastradas */}
      <section className={styles.cardSection}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span>📚</span> Questões Cadastradas ({questoes.length})
          </h2>
        </div>

        <div className={styles.filtersBar}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="filtro-tema-banco">
              Buscar por Tema
            </label>
            <input
              id="filtro-tema-banco"
              type="text"
              className={styles.input}
              placeholder="Filtrar temas..."
              value={filtroTema}
              onChange={(evento) => setFiltroTema(evento.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="filtro-tipo-banco">
              Filtrar por Tipo
            </label>
            <select
              id="filtro-tipo-banco"
              className={styles.select}
              value={filtroTipo}
              onChange={(evento) => setFiltroTipo(evento.target.value)}
            >
              <option value="">Todos os tipos</option>
              {TIPOS.map((tipo) => (
                <option key={tipo.valor} value={tipo.valor}>
                  {tipo.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        {carregando ? (
          <div className={styles.emptyState}>Carregando questões...</div>
        ) : questoes.length === 0 ? (
          <div className={styles.emptyState}>
            Nenhuma questão encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className={styles.questoesGrid}>
            {questoes.map((item) => (
              <article key={item.id} className={styles.questaoCard}>
                <div className={styles.questaoCardHeader}>
                  <div className={styles.headerMeta}>
                    <span className={`${styles.tipoBadge} ${getTipoBadgeClass(item.questao.tipo)}`}>
                      {formatTipoNome(item.questao.tipo)}
                    </span>
                    <span className={styles.temaTag}>• {item.tema}</span>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => iniciarEdicao(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.dangerBtn}
                      onClick={() => excluir(item.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <p className={styles.enunciadoText}>{item.questao.enunciado}</p>

                {(item.questao.tipo === "multipla-escolha" ||
                  item.questao.tipo === "resposta-unica") && (
                  <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
                    <strong>Alternativas ({item.questao.alternativas.length}):</strong>{" "}
                    {item.questao.alternativas.join(" | ")}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
