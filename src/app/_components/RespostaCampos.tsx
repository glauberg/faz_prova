"use client";

import type { Questao } from "../../domain/questao.ts";

interface RespostaCamposProps {
  indice: number;
  questao: Questao;
  valor: string | boolean | string[] | undefined;
  onChange: (valor: string | boolean | string[]) => void;
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

  if (questao.tipo === "multipla-escolha") {
    const selecionadas = Array.isArray(valor) ? valor : [];

    function alternar(alternativa: string) {
      if (selecionadas.includes(alternativa)) {
        onChange(selecionadas.filter((item) => item !== alternativa));
      } else {
        onChange([...selecionadas, alternativa]);
      }
    }

    return (
      <fieldset>
        <legend>
          {indice + 1}. {questao.enunciado}
        </legend>
        {questao.alternativas.map((alternativa) => (
          <label key={alternativa}>
            <input
              type="checkbox"
              checked={selecionadas.includes(alternativa)}
              onChange={() => alternar(alternativa)}
            />
            {alternativa}
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <label>
      {indice + 1}. {questao.enunciado}
      <select
        value={typeof valor === "string" ? valor : ""}
        onChange={(evento) => onChange(evento.target.value)}
      >
        <option value="">Sem resposta</option>
        {questao.alternativas.map((alternativa) => (
          <option key={alternativa} value={alternativa}>
            {alternativa}
          </option>
        ))}
      </select>
    </label>
  );
}
