# Relatório Final — Atividade Prática Assíncrona
**Projeto:** faz_prova | **Data:** 27/08/2026

## 1. Ferramenta(s) de IA configurada(s) e motivo
Claude Code (CLI agent), complementado por VS Code + Claude/Copilot para edições
pontuais. Escolhida por que eu disponho da assinatura para trabahos profissionais. Integra nativamente contexto de projeto persistente (`CLAUDE.md`), regras por escopo de diretório e servidores MCP, mantendo todo o fluxo dentro do terminal já usado para Git — ver `docs/adr/0001-escolha-da-ferramenta-de-ia.md`.

## 2. Trecho mais útil do CLAUDE.md
```
## Não fazer
- Não commitar segredos, tokens, .env ou credenciais de qualquer tipo
- Não alterar main diretamente — toda mudança entra via Pull Request
- Não aceitar código gerado por IA sem revisão humana explícita antes do commit
```
Motivo: a seção "Não fazer" é a que mais reduz risco operacional — restrições
negativas explícitas evitam que a IA tome atalhos (commit direto em main, código
não revisado) que só apareceriam como problema depois, no PR.

## 3. Diferença entre prompt fraco e prompt eficaz
O prompt fraco gerou uma função funcional, porém não testável e fora das convenções
do projeto, exigindo retrabalho manual. O prompt eficaz — com contexto (CLAUDE.md),
exemplo de padrão (função pura, testável por injeção de tempo), restrição (sem libs
externas) e critério de validação (pytest) — produziu código e teste já em
conformidade na primeira geração. Detalhamento completo em `docs/prompts-comparacao.md`.

## 4. Obstáculo enfrentado
Definir uma regra de escopo que efetivamente sobreponha o CLAUDE.md raiz sem
duplicar convenções. Isso foi resolvido criando `tests/CLAUDE.md` apenas com regras
específicas do diretório (padrão AAA, cobertura mínima), deixando convenções
globais (estilo, commits) apenas no arquivo raiz — evitando divergência entre os
dois arquivos.
