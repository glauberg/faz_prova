# ADR-001 — Adoção do TypeScript como linguagem principal

* **Status:** Aceito
* **Data:** 22/08/2026
* **Decisores:** Equipe do projeto

## Contexto

O projeto **Gestor de Provas** será desenvolvido de forma incremental, começando com uma aplicação simples e evoluindo gradualmente.

É necessário escolher uma linguagem que permita desenvolver rapidamente a aplicação, mantenha o código organizado e ofereça segurança de tipos à medida que o sistema crescer.

## Decisão

Adotar **TypeScript** como linguagem principal do projeto.

O TypeScript será utilizado tanto na implementação das regras de negócio quanto, quando aplicável, na camada de interface da aplicação.

## Justificativa

A escolha do TypeScript foi feita pelos seguintes motivos:

* oferece tipagem estática, reduzindo erros comuns durante o desenvolvimento;
* facilita a definição das entidades do domínio, como `Questao` e `Prova`;
* possui amplo suporte no desenvolvimento de aplicações web;
* permite evolução gradual do projeto sem exigir uma arquitetura complexa inicialmente;
* facilita a manutenção e compreensão do código por outros desenvolvedores;
* possui boa integração com ferramentas modernas de desenvolvimento apoiado por IA, incluindo o Claude CLI.

## Alternativas consideradas

### JavaScript

Seria uma alternativa mais simples inicialmente, porém não oferece tipagem estática nativa. Isso pode aumentar a ocorrência de erros à medida que o domínio do sistema se torna mais complexo.

### Java

Oferece forte tipagem e recursos robustos para sistemas maiores, mas introduziria uma complexidade desnecessária para o estágio inicial do projeto.

### Python

Possui excelente produtividade e poderia ser utilizado no backend, especialmente em futuras funcionalidades de IA. Entretanto, para uma aplicação web inicialmente simples, TypeScript permite manter uma linguagem única entre as diferentes camadas.

## Consequências

### Positivas

* Maior segurança durante a evolução do código.
* Melhor suporte da IDE e das ferramentas de desenvolvimento.
* Modelagem explícita das entidades do domínio.
* Possibilidade de utilizar a mesma linguagem no frontend e backend.
* Melhor previsibilidade para ferramentas de desenvolvimento apoiado por IA.

### Negativas

* Exige uma etapa adicional de compilação/transpilação.
* Desenvolvedores precisam conhecer conceitos específicos do sistema de tipos do TypeScript.
* Tipagem excessivamente complexa pode aumentar a complexidade do código.

## Revisão da decisão

Esta decisão poderá ser revisada caso o projeto passe a exigir componentes tecnológicos que justifiquem outra linguagem em uma camada específica, especialmente para funcionalidades avançadas de Inteligência Artificial ou processamento de dados.

Enquanto o sistema permanecer como uma aplicação web incremental, TypeScript continuará sendo a linguagem padrão do projeto.
