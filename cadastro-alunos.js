import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const btn = document.getElementById("btnCadastrar");
const mensagem = document.getElementById("mensagem");

btn.addEventListener("click", async () => {

  const texto = document
    .getElementById("listaAlunos")
    .value
    .trim();

  if (!texto) {
    alert("Informe os alunos.");
    return;
  }

  const alunos = texto
    .split("\n")
    .map(nome => nome.trim())
    .filter(nome => nome !== "");

  let cadastrados = 0;
  let ignorados = 0;

  for (const nome of alunos) {

    const q = query(
      collection(db, "alunos"),
      where("nome", "==", nome)
    );

    const resultado = await getDocs(q);

    if (!resultado.empty) {
      ignorados++;
      continue;
    }

    await addDoc(
      collection(db, "alunos"),
      {
        nome: nome,
        serie: "8º Ano",
        responsavelUid: ""
      }
    );

    cadastrados++;
  }

  mensagem.innerHTML = `
    ${cadastrados} aluno(s) cadastrados.<br>
    ${ignorados} já existiam.
  `;

});