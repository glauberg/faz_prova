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

const OPCOES_PAGINACAO = [5, 8, 15, 30, 0]; // 0 = Todas

export default function BancoQuestoesPage() {
  const router = useRouter();
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [filtroTema, setFiltroTema] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [buscaTexto, setBuscaTexto] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(8);

  const [formManualAberto, setFormManualAberto] = useState(false);
  const [formIaAberto, setFormIaAberto] = useState(false);
  const [expandedEnunciados, setExpandedEnunciados] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    carregar();
  }, [filtroTema, filtroTipo, router]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtroTema, filtroTipo, buscaTexto, itensPorPagina]);

  function iniciarEdicao(item: QuestaoBancoSalva) {
    setEditandoId(item.id);
    setTema(item.tema);
    setRascunho(paraQuestaoRascunho(item.questao));
    setFormManualAberto(true);
    window.scrollTo({ top: 150, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTema("");
    setRascunho(novaQuestaoRascunho());
    setFormManualAberto(false);
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
    setFormIaAberto(false);
  }

  function limparFiltros() {
    setFiltroTema("");
    setFiltroTipo("");
    setBuscaTexto("");
  }

  function toggleEnunciado(id: string) {
    setExpandedEnunciados((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // Filtragem local por palavra-chave no conteúdo
  const meQuestoes = questoes.filter((item) => {
    if (!buscaTexto.trim()) return true;
    const termo = buscaTexto.trim().toLowerCase();
    const noEnunciado = item.questao.enunciado.toLowerCase().includes(termo);
    const noTema = item.tema.toLowerCase().includes(termo);
    const nasAlternativas =
      (item.questao.tipo === "multipla-escolha" || item.questao.tipo === "resposta-unica") &&
      item.questao.alternativas.some((alt) => alt.toLowerCase().includes(termo));
    return noEnunciado || noTema || nasAlternativas;
  });

  // Cálculo de Paginação
  const totalItens = meQuestoes.length;
  const limite = itensPorPagina === 0 ? totalItens || 1 : itensPorPagina;
  const totalPaginas = Math.max(1, Math.ceil(totalItens / limite));
  const paginaValida = Math.min(paginaAtual, totalPaginas);
  const inicioIndice = (paginaValida - 1) * limite;
  const fimIndice = Math.min(inicioIndice + limite, totalItens);
  const meQuestoesPaginadas = meQuestoes.slice(inicioIndice, fimIndice);

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

  const temFiltrosAtivos = Boolean(filtroTema || filtroTipo || buscaTexto);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Banco de Questões</h1>
          <p className={styles.subtitle}>
            Organize seu acervo, crie questões manuais ou utilize Inteligência Artificial.
          </p>
        </div>

        <div className={styles.headerActions}>
          <span className={styles.badgeCount}>📚 {questoes.length} no banco</span>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setFormIaAberto((prev) => !prev)}
          >
            🤖 {formIaAberto ? "Fechar IA" : "Gerar com IA"}
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => {
              if (editandoId) {
                cancelarEdicao();
              } else {
                setFormManualAberto((prev) => !prev);
              }
            }}
          >
            {editandoId ? "✏️ Editando Questão" : formManualAberto ? "✕ Fechar Form" : "➕ Nova Questão"}
          </button>
        </div>
      </header>

      {/* Assistente de IA (Colapsável) */}
      {formIaAberto && (
        <section className={styles.cardSection}>
          <GeracaoQuestoesIa onQuestoesGeradas={adicionarGeradasPorIa} />
        </section>
      )}

      {/* Cadastro / Edição Manual (Colapsável) */}
      {(formManualAberto || editandoId) && (
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
              <button type="button" className={styles.secondaryBtn} onClick={cancelarEdicao}>
                Cancelar
              </button>
              <button type="submit" className={styles.primaryBtn} disabled={enviando || !tema.trim()}>
                {enviando ? "Salvando..." : editandoId ? "Salvar Alterações" : "Salvar no Banco"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filtros e Lista de Questões Cadastradas */}
      <section className={styles.cardSection}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span> Questões Cadastradas ({totalItens})
          </h2>
          {temFiltrosAtivos && (
            <button type="button" className={styles.secondaryBtn} onClick={limparFiltros}>
              ✕ Limpar Filtros
            </button>
          )}
        </div>

        {/* Toolbar de busca e filtros */}
        <div className={styles.filtersBar}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="busca-texto">
              Buscar Conteúdo / Palavra-chave
            </label>
            <input
              id="busca-texto"
              type="text"
              className={styles.input}
              placeholder="🔍 Buscar no enunciado ou alternativas..."
              value={buscaTexto}
              onChange={(e) => setBuscaTexto(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="filtro-tema-banco">
              Filtrar Tema
            </label>
            <input
              id="filtro-tema-banco"
              type="text"
              className={styles.input}
              placeholder="Filtrar por tema..."
              value={filtroTema}
              onChange={(evento) => setFiltroTema(evento.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="filtro-tipo-banco">
              Filtrar Tipo
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

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="itens-pagina">
              Itens por Página
            </label>
            <select
              id="itens-pagina"
              className={styles.select}
              value={itensPorPagina}
              onChange={(e) => setItensPorPagina(Number(e.target.value))}
            >
              {OPCOES_PAGINACAO.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao === 0 ? "Todas" : `${opcao} por página`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Resultados e Paginação */}
        {carregando ? (
          <div className={styles.emptyState}>Carregando questões...</div>
        ) : totalItens === 0 ? (
          <div className={styles.emptyState}>
            {temFiltrosAtivos
              ? "Nenhuma questão encontrada para os filtros selecionados."
              : "Nenhuma questão cadastrada no momento."}
          </div>
        ) : (
          <>
            {/* Indicador de faixa de itens */}
            <div className={styles.paginationInfo}>
              Exibindo <strong>{inicioIndice + 1}–{fimIndice}</strong> de <strong>{totalItens}</strong> questão(ões)
            </div>

            <div className={styles.questoesGrid}>
              {meQuestoesPaginadas.map((item) => {
                const isLong = item.questao.enunciado.length > 220;
                const isExpanded = Boolean(expandedEnunciados[item.id]);
                const enunciadoTexto =
                  isLong && !isExpanded
                    ? `${item.questao.enunciado.slice(0, 220)}...`
                    : item.questao.enunciado;

                return (
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

                    <div>
                      <p className={styles.enunciadoText}>{enunciadoTexto}</p>
                      {isLong && (
                        <button
                          type="button"
                          className={styles.expandTextBtn}
                          onClick={() => toggleEnunciado(item.id)}
                        >
                          {isExpanded ? "▲ Recolher" : "▼ Ver enunciado completo"}
                        </button>
                      )}
                    </div>

                    {/* Exibição de Alternativas e Gabarito */}
                    {(() => {
                      const q = item.questao;
                      if (q.tipo === "multipla-escolha") {
                        return (
                          <div className={styles.alternativasGrid}>
                            {q.alternativas.map((alt, idx) => {
                              const letra = String.fromCharCode(65 + idx);
                              const isCorreta = q.gabarito.includes(alt);

                              return (
                                <div
                                  key={idx}
                                  className={`${styles.alternativaRow} ${
                                    isCorreta ? styles.alternativaCorreta : ""
                                  }`}
                                >
                                  <span>
                                    <strong>({letra})</strong> {alt}
                                  </span>
                                  {isCorreta && (
                                    <span className={styles.badgeGabarito}>✓ Gabarito</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      if (q.tipo === "resposta-unica") {
                        return (
                          <div className={styles.alternativasGrid}>
                            {q.alternativas.map((alt, idx) => {
                              const letra = String.fromCharCode(65 + idx);
                              const isCorreta = q.gabarito === alt;

                              return (
                                <div
                                  key={idx}
                                  className={`${styles.alternativaRow} ${
                                    isCorreta ? styles.alternativaCorreta : ""
                                  }`}
                                >
                                  <span>
                                    <strong>({letra})</strong> {alt}
                                  </span>
                                  {isCorreta && (
                                    <span className={styles.badgeGabarito}>✓ Gabarito</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      }

                      if (q.tipo === "dicotomica") {
                        return (
                          <div
                            className={`${styles.gabaritoTag} ${
                              q.gabarito ? styles.gabaritoVerdadeiro : styles.gabaritoFalso
                            }`}
                          >
                            <span>Gabarito: {q.gabarito ? "Verdadeiro (V)" : "Falso (F)"}</span>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </article>
                );
              })}
            </div>

            {/* Controles de Paginação (Rodapé) */}
            {totalPaginas > 1 && (
              <div className={styles.paginationBar}>
                <div className={styles.paginationInfo}>
                  Página {paginaValida} de {totalPaginas}
                </div>

                <div className={styles.paginationControls}>
                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                    disabled={paginaValida === 1}
                  >
                    ◄ Anterior
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.pageBtn} ${
                        n === paginaValida ? styles.pageBtnActive : ""
                      }`}
                      onClick={() => setPaginaAtual(n)}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={styles.pageBtn}
                    onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                    disabled={paginaValida === totalPaginas}
                  >
                    Próximo ►
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
