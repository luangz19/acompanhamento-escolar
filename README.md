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

## Sistema Online

Link de acesso:

https://luangz19.github.io/acompanhamento-escolar/

## Principais Coleções

```text
usuarios
alunos
avaliacoes
```

## Segurança

As regras do Firestore garantem que:

* Professores podem cadastrar, editar e excluir informações.
* Responsáveis podem visualizar apenas os dados dos próprios filhos.
* Responsáveis não podem alterar avaliações ou notas.
* O acesso é realizado por meio do Firebase Authentication.

## Créditos

**Autor:** Luan Gonzaga Pires Costa

Sistema desenvolvido para acompanhamento do desempenho escolar dos alunos, permitindo que responsáveis acompanhem avaliações, médias e observações por meio de uma plataforma web e aplicativo móvel.

O desenvolvimento contou com apoio do ChatGPT (OpenAI) nas etapas de planejamento, estruturação do banco de dados, integração com Firebase, desenvolvimento web, desenvolvimento mobile, revisão de código e documentação.

## Licença

Este projeto foi desenvolvido para fins educacionais e de apoio à gestão escolar.
