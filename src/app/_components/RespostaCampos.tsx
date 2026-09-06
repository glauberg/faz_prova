"use client";

import type { Questao } from "../../domain/questao.ts";

interface RespostaCamposProps {
  indice: number;
  questao: Questao;
  valor: string | boolean | undefined;
  onChange: (valor: string | boolean) => void;
}

export function RespostaCampos({ indice, questao, valor, onChange }: RespostaCamposProps) {
  if (questao.tipo === "discursiva") {
    return (
      <p>
        <strong>Questão {indice + 1}</strong> ({questao.enunciado}): correção manual, não exige
        resposta aqui.
      </p>
    );
  }

  if (questao.tipo === "dicotomica") {
    return (
      <label>
        {indice + 1}. {questao.enunciado}
        <select
          value={valor === undefined ? "" : String(valor)}
          onChange={(evento) => onChange(evento.target.value === "true")}
        >
          <option value="">Sem resposta</option>
          <option value="true">Verdadeiro</option>
          <option value="false">Falso</option>
        </select>
      </label>
    );
  }

  return (
    <label>
      {indice + 1}. {questao.enunciado}
      <input
        type="text"
        value={typeof valor === "string" ? valor : ""}
        onChange={(evento) => onChange(evento.target.value)}
      />
    </label>
  );
}
