# Etapa 4 — Checkpoint Humano

## Checkpoint definido

**Antes de arquivar uma mudança do OpenSpec (`openspec archive`)** — o momento em que a spec de uma mudança é promovida de `openspec/changes/<nome>/specs/` para `openspec/specs/` (a spec "oficial" do projeto) — é obrigatória a revisão humana do código implementado e da spec antes de prosseguir.

**Por que esse ponto:** arquivar uma mudança é o equivalente, neste fluxo, a declarar a funcionalidade pronta e a spec "canônica" — depois disso, mudanças de comportamento passam a exigir uma nova mudança (delta) em vez de uma edição direta. É o último ponto barato para pegar um problema antes que ele vire a referência oficial do projeto (contrato para futuras funcionalidades, como a Funcionalidade B, que depende da `Prova` gerada pela Funcionalidade A).

## Simulação do checkpoint

**Situação:** todas as 13 tarefas de `openspec/changes/criacao-questionario/tasks.md` estavam marcadas como concluídas, `npm test` passava (13/13) e `tsc --noEmit` estava limpo. A execução foi pausada aqui, antes de rodar `openspec archive`, para a decisão humana.

**Revisão feita:**
- Os 7 requisitos e 12 (agora 13) cenários da spec (`specs/criacao-questionario/spec.md`) foram conferidos um a um contra os testes em `src/questao.test.ts` e `src/prova.test.ts` — todos cobertos.
- O código segue as convenções do `CLAUDE.md` (TypeScript, camelCase/PascalCase, funções pequenas com responsabilidade única, sem bibliotecas desnecessárias).
- A revisão de diff da Etapa 3 (`docs/etapa3-revisao-diff.md`) já havia identificado e corrigido a cobertura de teste do caso de borda `gabarito: false`.

**Decisão tomada: Aprovar como está.**

**Justificativa:** não há requisito da spec sem teste correspondente, não há decisão técnica não documentada, e o escopo implementado corresponde exatamente ao proposto em `proposal.md` (sem persistência, sem autenticação, sem exportação). Não há necessidade de editar a spec nem de rejeitar e voltar à especificação.

**Papel humano assumido:** revisor final de conformidade entre spec e implementação — não escrevi o código de validação linha a linha durante a implementação (isso foi feito pelo agente via `/opsx:apply`), mas confirmei manualmente, cenário por cenário, que a implementação atende ao que foi especificado antes de considerar a funcionalidade pronta para ser arquivada.
