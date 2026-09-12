"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Prova } from "../../../../domain/prova.ts";

export default function ExportarProvaPage() {
  const { id } = useParams<{ id: string }>();
  const [prova, setProva] = useState<Prova | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [incluirGabarito, setIncluirGabarito] = useState(false);

  useEffect(() => {
    fetch(`/api/provas/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "erro ao carregar a prova");
          return;
        }
        setProva(dados);
      })
      .catch(() => setErro("erro ao carregar a prova"));
  }, [id]);

  if (erro) {
    return <p className="erro">{erro}</p>;
  }

  if (!prova) {
    return <p>Carregando...</p>;
  }

  return (
    <main>
      <div className="no-imprimir">
        <h1>Exportar prova</h1>
        <label>
          <input
            type="checkbox"
            checked={incluirGabarito}
            onChange={(evento) => setIncluirGabarito(evento.target.checked)}
          />
          Incluir gabarito
        </label>
        <button type="button" onClick={() => window.print()}>
          Exportar PDF
        </button>
      </div>

      <article>
        <h1>{prova.titulo}</h1>
        <ol>
          {prova.questoes.map((questao, indice) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lista somente leitura, ordem vem do servidor
            <li key={indice}>
              <p>{questao.enunciado}</p>

              {questao.tipo === "multipla-escolha" && (
                <ol type="a">
                  {questao.alternativas.map((alternativa) => (
                    <li key={alternativa}>{alternativa}</li>
                  ))}
                </ol>
              )}

              {questao.tipo === "dicotomica" && (
                <p>( &nbsp;) Verdadeiro &nbsp;&nbsp; ( &nbsp;) Falso</p>
              )}

              {incluirGabarito && questao.tipo !== "discursiva" && (
                <p>
                  <strong>Gabarito:</strong>{" "}
                  {questao.tipo === "dicotomica"
                    ? questao.gabarito
                      ? "Verdadeiro"
                      : "Falso"
                    : questao.gabarito}
                </p>
              )}
            </li>
          ))}
        </ol>
      </article>
    </main>
  );
}
