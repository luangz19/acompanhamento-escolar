# Sistema de Acompanhamento Escolar

Sistema web para acompanhamento do desempenho dos alunos em Matemática.

## Objetivo

Permitir que os responsáveis acompanhem as avaliações, notas, médias e observações dos alunos de forma simples e segura.

O sistema utiliza Firebase Authentication para login e Cloud Firestore para armazenamento dos dados.

## Funcionalidades

### Área do Professor

- Login do professor.
- Cadastro de alunos.
- Lançamento de avaliações.
- Edição de avaliações.
- Exclusão de avaliações.
- Consulta das avaliações por aluno e bimestre.

### Área dos Responsáveis

- Login dos responsáveis.
- Consulta do aluno vinculado ao responsável.
- Visualização das avaliações por bimestre.
- Exibição da média bimestral.
- Exibição da situação do aluno.
- Consulta das observações feitas pelo professor.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Cloud Firestore
- GitHub Pages

## Estrutura do Firestore

As principais coleções são:

```text
usuarios
alunos
avaliacoes```