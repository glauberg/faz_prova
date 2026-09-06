## 1. Configuração do Supabase e Prisma

- [ ] 1.1 Criar projeto no Supabase e obter a URL de conexão do Postgres
- [ ] 1.2 Instalar `prisma` e `@prisma/client`, e inicializar `prisma/schema.prisma`
- [ ] 1.3 Configurar `DATABASE_URL` em `.env` (fora do controle de versão, conforme `CLAUDE.md`)

## 2. Schema Prisma

- [ ] 2.1 Modelar `Prova` e `Questao` (com discriminador de tipo) refletindo os tipos existentes em `src/prova.ts` e `src/questao.ts`
- [ ] 2.2 Modelar `ResultadoProva` e `ResultadoQuestao` refletindo os tipos existentes em `src/resposta.ts`, com relação obrigatória para uma `Prova` salva
- [ ] 2.3 Gerar e aplicar a migração inicial (`npx prisma migrate dev`) e verificar que `npx prisma generate` roda sem erros

## 3. Camada de persistência da prova

- [ ] 3.1 Implementar, em uma camada de persistência isolada (sem regra de negócio misturada), a função de salvar uma `Prova` validada via Prisma Client
- [ ] 3.2 Implementar a função de recuperar uma `Prova` por identificador, tratando identificador inexistente sem lançar erro não tratado
- [ ] 3.3 Testes cobrindo os cenários "Prova válida é salva com sucesso", "Prova salva é recuperada por identificador" e "Identificador inexistente não retorna prova"

## 4. Camada de persistência do resultado de correção

- [ ] 4.1 Implementar a função de salvar um `ResultadoProva` associado a uma prova persistida e a um identificador de aluno
- [ ] 4.2 Implementar a rejeição de um `ResultadoProva` que referencie uma prova inexistente no banco
- [ ] 4.3 Implementar a função de recuperar um `ResultadoProva` por identificador, tratando identificador inexistente sem lançar erro não tratado
- [ ] 4.4 Testes cobrindo os cenários de salvar, recuperar, identificador inexistente e associação obrigatória a uma prova persistida

## 5. Verificação final

- [ ] 5.1 Rodar `npm test` e `npx tsc --noEmit` e confirmar que a camada de persistência não altera o comportamento das Funcionalidades A e B já existentes
- [ ] 5.2 Confirmar que nenhuma credencial do Supabase foi versionada (revisar `git status`/`git diff` antes de commitar)
