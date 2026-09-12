# ADR-002 — Estrutura do monorepo: Next.js único com domain/persistence/app

* **Status:** Aceito
* **Data:** 06/09/2026
* **Decisores:** Equipe do projeto

## Contexto

O `CLAUDE.md` descreve o **Gestor de Provas** como um "monorepo web" desde o início, mas até esta decisão o código existente (`src/questao.ts`, `src/prova.ts`, `src/resposta.ts`, `src/correcao.ts`) era apenas lógica de domínio em TypeScript puro, sem nenhuma camada de interface, API ou persistência. A próxima etapa planejada (ver `CLAUDE.md`, seção "Próxima etapa") inclui persistência via Prisma/Supabase (especificada em `openspec/changes/adiciona-persistencia-prisma-supabase/`) e, por consequência, uma camada web para consumi-la — era necessário decidir a estrutura antes de começar a escrever UI, para não misturar tudo em `src/` sem separação.

As restrições do `CLAUDE.md` são diretamente relevantes aqui:
- "Não introduzir arquitetura de microsserviços."
- "Não adicionar bibliotecas apenas para resolver problemas simples que podem ser tratados com código nativo."
- "Manter componentes de interface separados da lógica de negócio."

## Decisão

Adotar **um único aplicativo Next.js (App Router)** hospedando frontend e backend, com a seguinte separação por pasta dentro de `src/`:

- `src/domain/` — lógica de negócio pura (tipos e validações de `Prova`, `Questao`, `RespostaAluno`, `ResultadoProva`, e a correção). Sem dependência de framework web nem de Prisma.
- `src/persistence/` — camada de persistência: Prisma Client e repositórios. Único ponto de acesso ao banco de dados (Supabase/Postgres).
- `src/app/api/` — backend HTTP: API routes do Next.js que expõem `domain` + `persistence`, sem regra de negócio própria.
- `src/app/**/page.tsx` — frontend: páginas e componentes React, que consomem apenas as API routes, nunca `src/persistence` diretamente.
- `src/cli.ts` — permanece como script de demonstração independente do app Next.js.

Um único `package.json`, um único processo de build/deploy.

## Alternativas consideradas

### `apps/web` + `apps/api` separados no mesmo repositório

Daria isolamento mais forte entre frontend e backend (dois `package.json`, dois processos), mas introduz complexidade operacional (dois deploys, comunicação entre eles via HTTP interno) sem um requisito real que a justifique hoje — o projeto não tem múltiplos consumidores de uma mesma API nem necessidade de escalar frontend e backend independentemente. Colide com a restrição de "não introduzir arquitetura de microsserviços" do `CLAUDE.md` em espírito, mesmo não sendo microsserviços em sentido estrito.

### Manter tudo em `src/` sem subpastas por camada

Seria a opção mais simples, mas repetiria o problema que motivou esta decisão: sem uma convenção explícita, nada impede que lógica de negócio, acesso a banco e componentes de UI se misturem no mesmo arquivo — violando diretamente "manter componentes de interface separados da lógica de negócio".

## Consequências

### Positivas
- Um único ponto de deploy, coerente com a proibição de microsserviços.
- Fronteiras de responsabilidade explícitas e nomeadas, facilitando revisão de diff (é possível notar rapidamente se uma mudança em `src/app` está importando algo de `src/persistence` que não deveria).
- Next.js App Router e Prisma são combinação comum no ecossistema Vercel/Supabase já adotado no projeto, reduzindo necessidade de configuração customizada.

### Negativas
- Introduz duas dependências novas de produção (`next`, `react`/`react-dom`) — justificado pela ausência de qualquer camada web anterior, não por substituir código nativo simples.
- A separação em pastas é, por enquanto, uma convenção documentada (`CLAUDE.md`) e não uma regra imposta por ferramenta (ex.: lint de import boundaries). Nada impede tecnicamente que `src/app` importe `src/persistence` diretamente hoje.

## Revisão da decisão

Se, no futuro, backend e frontend precisarem escalar ou fazer deploy de forma independente (por exemplo, múltiplos frontends consumindo a mesma API), esta decisão deve ser revisitada em favor de `apps/web` + `apps/api` separados. Até lá, um único app Next.js permanece a opção padrão do projeto.
