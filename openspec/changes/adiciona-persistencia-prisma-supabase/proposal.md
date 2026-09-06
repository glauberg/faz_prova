## Why

As Funcionalidades A (criação de questionário) e B (correção de questões objetivas) já estão implementadas e testadas, mas existem apenas em memória — `montarProva` e `corrigirProva` recebem e retornam dados que se perdem ao final da execução. O `CLAUDE.md` já define, na seção "Próxima etapa (planejada)", que a persistência da prova e do resultado da correção deve usar Supabase (Postgres) como banco de dados e Prisma como ORM/camada de acesso. Esta mudança especifica esse requisito antes de qualquer implementação.

## What Changes

- Adiciona à capability `criacao-questionario` o requisito de persistir uma `Prova` validada (salvar e recuperar por identificador) via Prisma Client, com o banco de dados hospedado no Supabase.
- Cria a nova capability `persistencia-resultado-correcao` para salvar e recuperar um `ResultadoProva` (produzido por `corrigirProva`), associado à prova e ao aluno correspondentes.
- Formaliza, via requisito de negócio, que um resultado de correção só pode ser salvo se referenciar uma prova já persistida.
- Não inclui o schema Prisma, migrações ou qualquer código de persistência — esta change é apenas de especificação. A implementação segue em uma change de apply separada, autorizada depois da revisão desta spec.
- Não inclui autenticação, exportação para PDF, correção automática de questões discursivas nem geração de feedback textual automático — itens explicitamente fora de escopo em `CLAUDE.md`.

## Capabilities

### New Capabilities
- `persistencia-resultado-correcao`: salvar e recuperar o resultado da correção de uma prova (`ResultadoProva`), associado a uma prova persistida e a um aluno.

### Modified Capabilities
- `criacao-questionario`: adiciona o requisito de persistência da `Prova` (salvar/recuperar via Prisma/Supabase), sem alterar os requisitos de validação já existentes.

## Impact

- Código futuro em `src/` (TypeScript): camada de persistência isolada por trás do Prisma Client, sem SQL cru e sem regra de negócio misturada (conforme convenções do `CLAUDE.md`).
- Novo `prisma/schema.prisma` e migrações versionadas.
- Nova dependência de infraestrutura externa: um projeto Supabase e a variável de ambiente com a URL de conexão do banco (fora do controle de versão).
- Novos testes automatizados cobrindo os cenários de persistência definidos nas specs desta change.
- Depende dos tipos e funções já existentes em `src/prova.ts`, `src/questao.ts`, `src/resposta.ts` e `src/correcao.ts` (Funcionalidades A e B); não os modifica.
