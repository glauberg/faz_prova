# Etapa 5 — Comparação entre OpenSpec e Markdown manual

## Ferramentas comparadas

- **Funcionalidade A** (criação de questionário): OpenSpec (`@fission-ai/openspec`), rodado via `npx` — `openspec/changes/criacao-questionario/` (arquivada em `openspec/changes/archive/2026-09-04-criacao-questionario/`), spec oficial em `openspec/specs/criacao-questionario/spec.md`.
- **Funcionalidade B** (correção de questões objetivas): Markdown manual, sem ferramenta — `docs/spec-manual/correcao-questoes/`.

## Artefatos gerados

| | OpenSpec | Markdown manual |
|---|---|---|
| Proposal | `proposal.md` com seções fixas (Why / What Changes / Capabilities / Impact), geradas pelo schema `spec-driven` | `proposal.md` escrito à mão, sem seção "Capabilities" (não existe o conceito de capability fora do OpenSpec) |
| Spec | `specs/<capability>/spec.md` com formato rígido: `### Requirement` + `#### Scenario` em WHEN/THEN, validado por `openspec validate` | `spec.md` livre, formato Given/When/Then escolhido por mim para atender ao roteiro da atividade — nada valida a estrutura automaticamente |
| Tasks | `tasks.md` com checkboxes, rastreado por `openspec status` (sabe quantas tarefas faltam) | `tasks.md` com checkboxes manuais — rastreamento de progresso é só visual, nenhuma ferramenta verifica |
| Rastreamento de estado | `openspec status --change <nome>` mostra `blocked`/`ready`/`done` por artefato e força a ordem de dependência (specs/design antes de tasks) | Nenhum — a ordem (proposal → spec → tasks) foi uma convenção que eu segui manualmente, nada impede pular etapas |
| Arquivamento | `openspec archive` promove a spec da mudança para `openspec/specs/`, criando um "estado oficial" do projeto | Não existe conceito de "spec oficial" separada da spec da mudança — `docs/spec-manual/correcao-questoes/spec.md` já é a única versão |

## Pontos positivos e negativos

**OpenSpec — positivos:**
- Estrutura forçada (schema) evita esquecer uma seção; `openspec validate` pega erros de formatação (ex.: cenário com `###` em vez de `####`) antes de eu perceber manualmente.
- `openspec status`/`instructions` guiam exatamente qual artefato criar a seguir e o que cada um deve conter — reduz a chance de pular um passo do SDD.
- O conceito de "capability" e o comando `archive` dão um modelo claro de versionamento de spec ao longo do tempo (spec da mudança → spec oficial do projeto), o que a Etapa 4 (checkpoint humano) desta atividade aproveitou diretamente.

**OpenSpec — negativos:**
- Overhead de setup (`npx @fission-ai/openspec@latest init`, entender a CLI) para uma mudança pequena como essa é desproporcional — para um projeto deste tamanho, boa parte da estrutura (`design.md` opcional, `.openspec.yaml`) não teve uso real.
- O fluxo empurra a decidir nomes de "capability" (kebab-case) e caminhos antes de eu ter certeza da organização final do domínio.

**Markdown manual — positivos:**
- Nenhuma dependência externa, zero setup — comecei a escrever a spec imediatamente.
- Liberdade total de formato: consegui adaptar a spec exatamente ao que o roteiro da atividade pedia (user story + PRD + Given/When/Then), enquanto o schema do OpenSpec tem sua própria estrutura fixa que não corresponde 1:1 ao que o roteiro pedia (por isso a Funcionalidade A precisou de `docs/etapa2-especificacao-sdd.md` como complemento).

**Markdown manual — negativos:**
- Nada impede inconsistência: nenhuma ferramenta avisa se um requisito da spec ficou sem cenário correspondente, ou se o `tasks.md` ficou desatualizado em relação à spec — a disciplina de manter tudo coerente é 100% minha.
- Sem rastreamento de estado: não há como perguntar "quais artefatos já foram criados para esta mudança" a uma ferramenta — preciso lembrar/conferir manualmente.
- Sem o conceito de "arquivar"/promover spec: se o projeto crescesse, ficaria ambíguo qual arquivo é a spec "atual" do sistema versus o histórico de mudanças, algo que o OpenSpec resolve por design.

## Comparação do código gerado

Ambas as funcionalidades resultaram em arquitetura equivalente — módulo de tipos + módulo de regra de negócio + módulo de testes, seguindo as convenções do `CLAUDE.md` (TypeScript, funções pequenas, lógica de negócio separada de qualquer interface). Nenhuma das duas abordagens de spec influenciou a arquitetura do código; a diferença esteve inteiramente no processo de especificação, não na implementação. Ambas atendem integralmente aos requisitos que suas respectivas specs descrevem (12 cenários / 13 testes na Funcionalidade A; 5 cenários / 5 testes na Funcionalidade B), confirmado por `npm test` (18/18 passando) e `tsc --noEmit` limpo em ambas.

Uma diferença notável: a spec do OpenSpec, por ser mais rígida, me obrigou a decompor a Funcionalidade A em 7 requisitos "atômicos" (um por tipo de questão + regras transversais). A spec manual, mais livre, ficou organizada por cenário de uso (5 Given/When/Then) em vez de por requisito atômico — o que tornou o plano de tarefas da Funcionalidade B mais fácil de revisar e consolidar (9 tarefas em vez de 13), já que cenários de uso mapeiam mais diretamente para casos de teste do que requisitos por tipo mapeiam para tarefas de implementação.

## O que foi feito e o que se aprendeu

Repeti o fluxo completo de SDD (user story → PRD → critérios Given/When/Then com um caso de borda → plano de tarefas revisado e justificado → implementação → revisão de diff) para a Funcionalidade B, desta vez escrevendo a spec manualmente em Markdown em vez de usar o OpenSpec. A principal lição foi que **a ferramenta não substitui a disciplina de revisão** — o OpenSpec ajuda a não esquecer uma seção, mas a qualidade de um requisito ou cenário depende de mim nos dois casos; a revisão de diff da Funcionalidade B encontrou um problema real (trim de espaços na resposta do aluno) que nenhuma das duas ferramentas teria pego automaticamente, porque é uma decisão de domínio, não de formato de spec. Para um projeto pequeno como este, o Markdown manual foi mais rápido de começar, mas o OpenSpec deu mais garantia de completude estrutural — a escolha ideal depende do tamanho do projeto e de quantas pessoas mexem na mesma spec ao longo do tempo.
