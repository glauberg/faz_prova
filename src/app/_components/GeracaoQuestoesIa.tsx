"use client";

import { useState } from "react";
import type { Questao } from "../../domain/questao.ts";

interface QuantidadesRascunho {
  discursiva: number;
  "multipla-escolha": number;
  dicotomica: number;
  "resposta-unica": number;
}

const CAMPOS_QUANTIDADE: { tipo: Questao["tipo"]; rotulo: string }[] = [
  { tipo: "discursiva", rotulo: "Discursivas" },
  { tipo: "multipla-escolha", rotulo: "Múltipla escolha" },
  { tipo: "dicotomica", rotulo: "Dicotômicas" },
  { tipo: "resposta-unica", rotulo: "Resposta única" },
];

function quantidadesVazias(): QuantidadesRascunho {
  return { discursiva: 0, "multipla-escolha": 0, dicotomica: 0, "resposta-unica": 0 };
}

interface GeracaoQuestoesIaProps {
  onQuestoesGeradas: (questoes: Questao[]) => void;
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

      onQuestoesGeradas(dados.questoes as Questao[]);
    } finally {
      setGerando(false);
    }
  }

  return (
    <fieldset className="geracao-ia">
      <legend>Gerar questões com IA</legend>

      <label>
        Tema
        <input type="text" value={tema} onChange={(evento) => setTema(evento.target.value)} />
      </label>

      <label>
        Referência bibliográfica
        <textarea
          value={referenciaBibliografica}
          onChange={(evento) => setReferenciaBibliografica(evento.target.value)}
        />
      </label>

      {CAMPOS_QUANTIDADE.map(({ tipo, rotulo }) => (
        <label key={tipo}>
          {rotulo}
          <input
            type="number"
            min={0}
            value={quantidades[tipo]}
            onChange={(evento) =>
              setQuantidades((atual) => ({
                ...atual,
                [tipo]: Number(evento.target.value) || 0,
              }))
            }
          />
        </label>
      ))}

      {erro && <p className="erro">{erro}</p>}

      <button
        type="button"
        onClick={gerar}
        disabled={gerando || !tema.trim() || !referenciaBibliografica.trim()}
      >
        {gerando ? "Gerando..." : "Gerar questões"}
      </button>
    </fieldset>
  );
}
