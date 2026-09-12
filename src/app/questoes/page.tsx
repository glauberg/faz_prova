"use client";

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

const TIPOS: { valor: Questao["tipo"]; rotulo: string }[] = [
  { valor: "discursiva", rotulo: "Discursiva" },
  { valor: "multipla-escolha", rotulo: "Múltipla escolha" },
  { valor: "dicotomica", rotulo: "Dicotômica (verdadeiro/falso)" },
  { valor: "resposta-unica", rotulo: "Resposta única" },
];

export default function BancoQuestoesPage() {
  const [questoes, setQuestoes] = useState<QuestaoBancoSalva[]>([]);
  const [filtroTema, setFiltroTema] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [tema, setTema] = useState("");
  const [rascunho, setRascunho] = useState<QuestaoRascunho>(novaQuestaoRascunho());
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function carregar() {
    const parametros = new URLSearchParams();
    if (filtroTema.trim()) {
      parametros.set("tema", filtroTema.trim());
    }
    if (filtroTipo) {
      parametros.set("tipo", filtroTipo);
    }

    fetch(`/api/questoes?${parametros.toString()}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        setQuestoes(resposta.ok ? (dados.questoes ?? []) : []);
      })
      .catch(() => setQuestoes([]));
  }

  useEffect(carregar, [filtroTema, filtroTipo]);

  function iniciarEdicao(item: QuestaoBancoSalva) {
    setEditandoId(item.id);
    setTema(item.tema);
    setRascunho(paraQuestaoRascunho(item.questao));
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
    } finally {
      setEnviando(false);
    }
  }

  async function excluir(id: string) {
    await fetch(`/api/questoes/${id}`, { method: "DELETE" });
    carregar();
  }

  function adicionarGeradasPorIa(geradas: QuestaoBancoSalva[]) {
    setQuestoes((atual) => [...geradas, ...atual]);
  }

  return (
    <main>
      <h1>Banco de questões</h1>

      <GeracaoQuestoesIa onQuestoesGeradas={adicionarGeradasPorIa} />

      <h2>{editandoId ? "Editar questão" : "Nova questão"}</h2>
      <form onSubmit={salvar}>
        <label>
          Tema
          <input
            type="text"
            value={tema}
            onChange={(evento) => setTema(evento.target.value)}
            required
          />
        </label>

        <QuestaoCampos questao={rascunho} onChange={setRascunho} />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : editandoId ? "Salvar alterações" : "Adicionar ao banco"}
        </button>
        {editandoId && (
          <button type="button" onClick={cancelarEdicao}>
            Cancelar edição
          </button>
        )}
      </form>

      <h2>Questões cadastradas</h2>
      <label>
        Filtrar por tema
        <input
          type="text"
          value={filtroTema}
          onChange={(evento) => setFiltroTema(evento.target.value)}
        />
      </label>
      <label>
        Filtrar por tipo
        <select value={filtroTipo} onChange={(evento) => setFiltroTipo(evento.target.value)}>
          <option value="">Todos</option>
          {TIPOS.map((tipo) => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.rotulo}
            </option>
          ))}
        </select>
      </label>

      <ul>
        {questoes.map((item) => (
          <li key={item.id}>
            <strong>[{item.questao.tipo}]</strong> {item.tema}: {item.questao.enunciado}{" "}
            <button type="button" onClick={() => iniciarEdicao(item)}>
              Editar
            </button>
            <button type="button" onClick={() => excluir(item.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
