import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const sairBtn = document.getElementById("sairBtn");
const usuarioNome = document.getElementById("usuarioNome");
const filtroBimestre = document.getElementById("filtroBimestre");
const filtroAluno = document.getElementById("filtroAluno");
const btnFiltrar = document.getElementById("btnFiltrar");
const listaAvaliacoes = document.getElementById("listaAvaliacoes");

let alunos = [];
let avaliacoes = [];

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

btnFiltrar.addEventListener("click", carregarAvaliacoes);

async function carregarAlunos() {
  const q = query(collection(db, "alunos"), where("serie", "==", "8º Ano"));
  const resultado = await getDocs(q);

  alunos = [];
  filtroAluno.innerHTML = `<option value="">Selecione um aluno</option>`;

  resultado.forEach((docAluno) => {
    alunos.push({ id: docAluno.id, ...docAluno.data() });
  });

  alunos.sort((a, b) => a.nome.localeCompare(b.nome));

  alunos.forEach((aluno) => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.nome;
    filtroAluno.appendChild(option);
  });
}

async function carregarAvaliacoes() {
  const alunoId = filtroAluno.value;
  const bimestre = filtroBimestre.value;

  listaAvaliacoes.innerHTML = "";

  if (!alunoId) {
    listaAvaliacoes.innerHTML = "<p>Selecione um aluno para visualizar as avaliações.</p>";
    return;
  }

  const q = query(collection(db, "avaliacoes"), where("alunoId", "==", alunoId));
  const resultado = await getDocs(q);

  avaliacoes = [];

  resultado.forEach((docAvaliacao) => {
    const av = { id: docAvaliacao.id, ...docAvaliacao.data() };

    if (bimestre !== "todos" && av.bimestre !== bimestre) return;

    avaliacoes.push(av);
  });

  avaliacoes.sort((a, b) => a.dataAvaliacao.localeCompare(b.dataAvaliacao));

  renderizarAvaliacoes();
}

function renderizarAvaliacoes() {
  listaAvaliacoes.innerHTML = "";

  const aluno = alunos.find((a) => a.id === filtroAluno.value);

  if (!aluno) {
    listaAvaliacoes.innerHTML = "<p>Aluno não encontrado.</p>";
    return;
  }

  if (avaliacoes.length === 0) {
    listaAvaliacoes.innerHTML = `<p>Nenhuma avaliação encontrada para ${aluno.nome}.</p>`;
    return;
  }

  let html = `
    <h3>${aluno.nome}</h3>

    <table>
      <thead>
        <tr>
          <th>Avaliação</th>
          <th>Bimestre</th>
          <th>Data</th>
          <th>Nota</th>
          <th>Observação</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  avaliacoes.forEach((av) => {
    html += `
      <tr>
        <td>
          <input 
            type="text" 
            id="titulo-${av.id}" 
            value="${av.titulo || ""}"
          >
        </td>

        <td>
          <select id="bimestre-${av.id}">
            <option value="1º Bimestre" ${av.bimestre === "1º Bimestre" ? "selected" : ""}>1º Bimestre</option>
            <option value="2º Bimestre" ${av.bimestre === "2º Bimestre" ? "selected" : ""}>2º Bimestre</option>
            <option value="3º Bimestre" ${av.bimestre === "3º Bimestre" ? "selected" : ""}>3º Bimestre</option>
            <option value="4º Bimestre" ${av.bimestre === "4º Bimestre" ? "selected" : ""}>4º Bimestre</option>
          </select>
        </td>

        <td>
          <input 
            type="date" 
            id="data-${av.id}" 
            value="${av.dataAvaliacao || ""}"
          >
        </td>

        <td>
          <input 
            type="number" 
            min="0" 
            max="10" 
            step="0.1" 
            id="nota-${av.id}" 
            value="${av.nota}"
          >
        </td>

        <td>
          <textarea id="obs-${av.id}">${av.observacao || ""}</textarea>
        </td>

        <td>
          <button class="btn-pequeno salvar" data-id="${av.id}">
            Salvar
          </button>

          <button class="btn-pequeno btn-sair excluir" data-id="${av.id}">
            Excluir
          </button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  listaAvaliacoes.innerHTML = html;

  document.querySelectorAll(".salvar").forEach((botao) => {
    botao.addEventListener("click", async () => {
      await salvarAlteracao(botao.dataset.id);
    });
  });

  document.querySelectorAll(".excluir").forEach((botao) => {
    botao.addEventListener("click", async () => {
      if (!confirm("Deseja excluir esta avaliação?")) return;

      await deleteDoc(doc(db, "avaliacoes", botao.dataset.id));
      await carregarAvaliacoes();
    });
  });
}

async function salvarAlteracao(id) {
  const titulo = document.getElementById(`titulo-${id}`).value.trim();
  const bimestre = document.getElementById(`bimestre-${id}`).value;
  const dataAvaliacao = document.getElementById(`data-${id}`).value;
  const nota = document.getElementById(`nota-${id}`).value;
  const observacao = document.getElementById(`obs-${id}`).value.trim();

  if (!titulo) {
    alert("Informe o título da avaliação.");
    return;
  }

  if (!dataAvaliacao) {
    alert("Informe a data da avaliação.");
    return;
  }

  if (nota === "") {
    alert("Informe a nota.");
    return;
  }

  try {
    await updateDoc(doc(db, "avaliacoes", id), {
      titulo,
      bimestre,
      dataAvaliacao,
      nota: Number(nota),
      observacao: observacao || "Sem observação específica.",
      atualizadoEm: new Date().toISOString()
    });

    alert("Avaliação atualizada com sucesso.");

    await carregarAvaliacoes();

  } catch (error) {
    console.error(error);
    alert("Erro ao atualizar a avaliação.");
  }
}