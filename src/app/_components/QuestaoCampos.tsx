"use client";

import type { Questao } from "../../domain/questao.ts";
import type { QuestaoRascunho } from "./questaoRascunho.ts";

interface QuestaoCamposProps {
  indice: number;
  questao: QuestaoRascunho;
  onChange: (questao: QuestaoRascunho) => void;
  onRemover: () => void;
}

const TIPOS: { valor: Questao["tipo"]; rotulo: string }[] = [
  { valor: "discursiva", rotulo: "Discursiva" },
  { valor: "multipla-escolha", rotulo: "Múltipla escolha" },
  { valor: "dicotomica", rotulo: "Dicotômica (verdadeiro/falso)" },
  { valor: "resposta-unica", rotulo: "Resposta única" },
];

export function QuestaoCampos({ indice, questao, onChange, onRemover }: QuestaoCamposProps) {
  return (
    <fieldset className="questao-rascunho">
      <legend>Questão {indice + 1}</legend>

      <label>
        Tipo
        <select
          value={questao.tipo}
          onChange={(evento) =>
            onChange({ ...questao, tipo: evento.target.value as Questao["tipo"] })
          }
        >
          {TIPOS.map((tipo) => (
            <option key={tipo.valor} value={tipo.valor}>
              {tipo.rotulo}
            </option>
          ))}
        </select>
      </label>

      <label>
        Enunciado
        <textarea
          value={questao.enunciado}
          onChange={(evento) => onChange({ ...questao, enunciado: evento.target.value })}
          required
        />
      </label>

      {questao.tipo === "multipla-escolha" && (
        <>
          <label>
            Alternativas (uma por linha)
            <textarea
              value={questao.alternativasTexto}
              onChange={(evento) =>
                onChange({ ...questao, alternativasTexto: evento.target.value })
              }
            />
          </label>
          <label>
            Gabarito (deve ser igual a uma das alternativas)
            <input
              type="text"
              value={questao.gabaritoTexto}
              onChange={(evento) => onChange({ ...questao, gabaritoTexto: evento.target.value })}
            />
          </label>
        </>
      )}

      {questao.tipo === "dicotomica" && (
        <label>
          Gabarito
          <select
            value={String(questao.gabaritoBooleano)}
            onChange={(evento) =>
              onChange({ ...questao, gabaritoBooleano: evento.target.value === "true" })
            }
          >
            <option value="true">Verdadeiro</option>
            <option value="false">Falso</option>
          </select>
        </label>
      )}

      {questao.tipo === "resposta-unica" && (
        <label>
          Gabarito
          <input
            type="text"
            value={questao.gabaritoTexto}
            onChange={(evento) => onChange({ ...questao, gabaritoTexto: evento.target.value })}
          />
        </label>
      )}

      <button type="button" onClick={onRemover}>
        Remover questão
      </button>
    </fieldset>
  );
}
