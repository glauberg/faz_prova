"use client";

import type { Questao } from "../../domain/questao.ts";
import styles from "./QuestaoCampos.module.css";
import type { QuestaoRascunho } from "./questaoRascunho.ts";

interface QuestaoCamposProps {
  questao: QuestaoRascunho;
  onChange: (questao: QuestaoRascunho) => void;
}

const TIPOS: { valor: Questao["tipo"]; rotulo: string }[] = [
  { valor: "discursiva", rotulo: "Discursiva" },
  { valor: "multipla-escolha", rotulo: "Múltipla Escolha" },
  { valor: "dicotomica", rotulo: "Dicotômica (Verdadeiro/Falso)" },
  { valor: "resposta-unica", rotulo: "Resposta Única" },
];

export function QuestaoCampos({ questao, onChange }: QuestaoCamposProps) {
  return (
    <fieldset className={styles.cardForm}>
      <legend className={styles.legend}>Detalhes da Questão</legend>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="questao-tipo">
            Tipo de Questão
          </label>
          <select
            id="questao-tipo"
            className={styles.select}
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
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="questao-enunciado">
            Enunciado da Questão
          </label>
          <textarea
            id="questao-enunciado"
            className={styles.textarea}
            placeholder="Digite o enunciado completo da questão..."
            value={questao.enunciado}
            onChange={(evento) => onChange({ ...questao, enunciado: evento.target.value })}
            required
          />
        </div>
      </div>

      {questao.tipo === "multipla-escolha" && (
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="alt-multipla">
              Alternativas
            </label>
            <span className={styles.hint}>Digite uma alternativa por linha</span>
            <textarea
              id="alt-multipla"
              className={styles.textarea}
              placeholder="Opção A&#10;Opção B&#10;Opção C"
              value={questao.alternativasTexto}
              onChange={(evento) =>
                onChange({ ...questao, alternativasTexto: evento.target.value })
              }
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.gabaritoHighlight}`}>
            <label className={styles.label} htmlFor="gab-multipla">
              Gabarito das Respostas Corretas
            </label>
            <span className={styles.hint}>
              Digite uma ou mais alternativas corretas (exatamente iguais às anteriores, uma por
              linha)
            </span>
            <textarea
              id="gab-multipla"
              className={styles.textarea}
              placeholder="Opção A&#10;Opção C"
              value={questao.gabaritoTexto}
              onChange={(evento) => onChange({ ...questao, gabaritoTexto: evento.target.value })}
            />
          </div>
        </div>
      )}

      {questao.tipo === "dicotomica" && (
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="gab-dicotomica">
            Gabarito da Questão (Verdadeiro ou Falso)
          </label>
          <select
            id="gab-dicotomica"
            className={styles.select}
            value={String(questao.gabaritoBooleano)}
            onChange={(evento) =>
              onChange({ ...questao, gabaritoBooleano: evento.target.value === "true" })
            }
          >
            <option value="true">Verdadeiro</option>
            <option value="false">Falso</option>
          </select>
        </div>
      )}

      {questao.tipo === "resposta-unica" && (
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="alt-unica">
              Alternativas
            </label>
            <span className={styles.hint}>Digite uma alternativa por linha</span>
            <textarea
              id="alt-unica"
              className={styles.textarea}
              placeholder="Alternativa 1&#10;Alternativa 2&#10;Alternativa 3"
              value={questao.alternativasTexto}
              onChange={(evento) =>
                onChange({ ...questao, alternativasTexto: evento.target.value })
              }
            />
          </div>

          <div className={`${styles.inputGroup} ${styles.gabaritoHighlight}`}>
            <label className={styles.label} htmlFor="gab-unica">
              Gabarito (Resposta Correta)
            </label>
            <span className={styles.hint}>Deve ser idêntico a uma das alternativas acima</span>
            <input
              id="gab-unica"
              type="text"
              className={styles.input}
              placeholder="Ex: Alternativa 2"
              value={questao.gabaritoTexto}
              onChange={(evento) => onChange({ ...questao, gabaritoTexto: evento.target.value })}
            />
          </div>
        </div>
      )}
    </fieldset>
  );
}
