import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const sairBtn = document.getElementById("sairBtn");
const usuarioNome = document.getElementById("usuarioNome");
const notasForm = document.getElementById("notasForm");
const mensagem = document.getElementById("mensagem");
const alunoSelect = document.getElementById("alunoId");

let alunos = [];

sairBtn.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  if (localStorage.getItem("usuarioTipo") !== "professor") {
    window.location.href = "pais.html";
    return;
  }

  usuarioNome.textContent = `Professor: ${localStorage.getItem("usuarioNome") || ""}`;

  await carregarAlunos();
});

async function carregarAlunos() {
  const q = query(
    collection(db, "alunos"),
    where("serie", "==", "8º Ano")
  );

  const resultado = await getDocs(q);

  alunos = [];
  alunoSelect.innerHTML = `<option value="">Selecione um aluno</option>`;

  resultado.forEach((docAluno) => {
    alunos.push({
      id: docAluno.id,
      ...docAluno.data()
    });
  });

  alunos.sort((a, b) => a.nome.localeCompare(b.nome));

  alunos.forEach((aluno) => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });
}

notasForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const bimestre = document.getElementById("bimestre").value;
  const dataAvaliacao = document.getElementById("dataAvaliacao").value;
  const alunoId = document.getElementById("alunoId").value;
  const nota = document.getElementById("nota").value;
  const observacao = document.getElementById("observacao").value.trim();

  if (!alunoId) {
    alert("Selecione um aluno.");
    return;
  }

  try {
    await addDoc(collection(db, "avaliacoes"), {
      alunoId,
      titulo,
      bimestre,
      dataAvaliacao,
      nota: Number(nota),
      observacao: observacao || "Sem observação específica.",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    });

    mensagem.style.color = "#15803d";
    mensagem.textContent = "Nota salva com sucesso.";

    document.getElementById("alunoId").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("observacao").value = "";

  } catch (error) {
    console.error(error);
    mensagem.style.color = "#b91c1c";
    mensagem.textContent = "Erro ao salvar nota.";
  }
});