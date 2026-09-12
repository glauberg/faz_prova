## ADDED Requirements

### Requirement: Persistência da prova
O sistema SHALL permitir salvar uma `Prova` validada (retornada por `montarProva`) em um banco de dados Postgres hospedado no Supabase, através do Prisma Client, e recuperá-la posteriormente por identificador.

#### Scenario: Prova válida é salva com sucesso
- **WHEN** uma `Prova` validada é submetida para persistência
- **THEN** o sistema salva a prova e todas as suas questões no banco de dados e retorna um identificador único para ela

#### Scenario: Prova salva é recuperada por identificador
- **WHEN** um identificador de uma prova previamente salva é informado
- **THEN** o sistema retorna a `Prova` completa (título e questões, incluindo o tipo e o gabarito de cada uma) reconstituída a partir do banco de dados

#### Scenario: Identificador inexistente não retorna prova
- **WHEN** um identificador que não corresponde a nenhuma prova salva é informado
- **THEN** o sistema indica que a prova não foi encontrada, sem lançar um erro não tratado
