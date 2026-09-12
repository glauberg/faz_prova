## Purpose

Permite salvar e recuperar o resultado da correção de uma prova (`ResultadoProva`), associando-o à prova e ao aluno correspondentes, usando Supabase (Postgres) como banco de dados através do Prisma.

## Requirements

### Requirement: Persistência do resultado de correção
O sistema SHALL permitir salvar um `ResultadoProva` (produzido por `corrigirProva`), associado ao identificador de uma prova persistida e a um identificador de aluno.

#### Scenario: Resultado de correção é salvo com sucesso
- **WHEN** um `ResultadoProva` é submetido para persistência, associado ao identificador de uma prova salva e a um identificador de aluno
- **THEN** o sistema salva o resultado — nota das objetivas, total de objetivas e detalhamento por questão — no banco de dados e retorna um identificador único para ele

### Requirement: Recuperação do resultado de correção
O sistema SHALL permitir recuperar um `ResultadoProva` previamente salvo a partir do seu identificador.

#### Scenario: Resultado salvo é recuperado por identificador
- **WHEN** um identificador de um resultado de correção previamente salvo é informado
- **THEN** o sistema retorna o `ResultadoProva` completo (nota das objetivas, total de objetivas e detalhamento por questão) reconstituído a partir do banco de dados

#### Scenario: Identificador inexistente não retorna resultado
- **WHEN** um identificador que não corresponde a nenhum resultado salvo é informado
- **THEN** o sistema indica que o resultado não foi encontrado, sem lançar um erro não tratado

### Requirement: Associação obrigatória a uma prova persistida
O sistema SHALL exigir que um `ResultadoProva` só seja salvo se referenciar uma `Prova` já persistida no banco de dados.

#### Scenario: Resultado referenciando prova inexistente é rejeitado
- **WHEN** a persistência de um `ResultadoProva` é solicitada referenciando um identificador de prova que não existe no banco de dados
- **THEN** o sistema rejeita a operação, sem salvar o resultado
