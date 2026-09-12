"use client";

import { useEffect, useState } from "react";
import type { QuestaoBancoSalva } from "../../domain/questaoBanco.ts";

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

  return (
    <fieldset className="seletor-questoes-banco">
      <legend>Selecionar questões do banco</legend>

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
          <option value="discursiva">Discursiva</option>
          <option value="multipla-escolha">Múltipla escolha</option>
          <option value="dicotomica">Dicotômica</option>
          <option value="resposta-unica">Resposta única</option>
        </select>
      </label>

      <ul>
        {disponiveis.map((questao) => (
          <li key={questao.id}>
            <strong>[{questao.questao.tipo}]</strong> {questao.tema}: {questao.questao.enunciado}{" "}
            <button type="button" onClick={() => alternar(questao.id)}>
              {selecionadas.includes(questao.id) ? "Remover" : "Adicionar"}
            </button>
          </li>
        ))}
      </ul>

      <h3>Questões selecionadas ({selecionadas.length})</h3>
      <ol>
        {selecionadas.map((id, indice) => {
          const questao = questoesPorId.get(id);
          return (
            <li key={id}>
              {questao ? `[${questao.questao.tipo}] ${questao.questao.enunciado}` : id}{" "}
              <button type="button" onClick={() => mover(indice, -1)} disabled={indice === 0}>
                Mover para cima
              </button>
              <button
                type="button"
                onClick={() => mover(indice, 1)}
                disabled={indice === selecionadas.length - 1}
              >
                Mover para baixo
              </button>
              <button type="button" onClick={() => alternar(id)}>
                Remover
              </button>
            </li>
          );
        })}
      </ol>
    </fieldset>
  );
}
