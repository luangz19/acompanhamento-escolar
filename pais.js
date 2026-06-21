import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const usuarioNome = document.getElementById("usuarioNome");
const filhosDiv = document.getElementById("filhos");
const desempenhoDiv = document.getElementById("desempenho");

document.getElementById("sairBtn").addEventListener("click", async () => {
  await signOut(auth);
  localStorage.clear();
  window.location.href = "index.html";
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  usuarioNome.textContent = `Responsável: ${localStorage.getItem("usuarioNome") || ""}`;

  await carregarFilhos(user.uid);
});

async function carregarFilhos(responsavelUid) {
  const q = query(
    collection(db, "alunos"),
    where("responsavelUid", "==", responsavelUid),
    where("serie", "==", "8º Ano")
  );

  const resultado = await getDocs(q);

  filhosDiv.innerHTML = "";

  if (resultado.empty) {
    filhosDiv.innerHTML = "<p>Nenhum aluno do 8º ano encontrado.</p>";
    return;
  }

  resultado.forEach((docAluno) => {
    const aluno = { id: docAluno.id, ...docAluno.data() };

    const card = document.createElement("div");
    card.className = "filho-card";

    card.innerHTML = `
      <h3>${aluno.nome}</h3>
      <p><strong>Série:</strong> ${aluno.serie}</p>

      <div class="bimestre-botoes">
        <button data-bimestre="1º Bimestre">1º Bimestre</button>
        <button data-bimestre="2º Bimestre">2º Bimestre</button>
        <button data-bimestre="3º Bimestre">3º Bimestre</button>
        <button data-bimestre="4º Bimestre">4º Bimestre</button>
      </div>
    `;

    filhosDiv.appendChild(card);

    card.querySelectorAll(".bimestre-botoes button").forEach((botao) => {
      botao.addEventListener("click", () => {
        carregarAvaliacoes(aluno, botao.dataset.bimestre);
      });
    });
  });
}

async function carregarAvaliacoes(aluno, bimestreSelecionado) {
  const q = query(
    collection(db, "avaliacoes"),
    where("alunoId", "==", aluno.id)
  );

  const resultado = await getDocs(q);

  let avaliacoes = [];

  resultado.forEach((docAvaliacao) => {
    avaliacoes.push({
      id: docAvaliacao.id,
      ...docAvaliacao.data()
    });
  });

  avaliacoes = avaliacoes.filter(
    (av) => av.bimestre === bimestreSelecionado
  );

  avaliacoes.sort((a, b) =>
    a.dataAvaliacao.localeCompare(b.dataAvaliacao)
  );

  const mediaBimestre = calcularMedia(avaliacoes);
  const situacao = definirSituacao(mediaBimestre);

  let html = `
    <h3>${aluno.nome}</h3>
    <p><strong>Série:</strong> ${aluno.serie}</p>

    <div class="media">
      ${bimestreSelecionado} - Média: ${mediaBimestre}
      <span class="situacao">${situacao}</span>
    </div>
  `;

  if (avaliacoes.length === 0) {
    desempenhoDiv.innerHTML =
      html + `<p>Não há avaliações cadastradas para o ${bimestreSelecionado}.</p>`;
    return;
  }

  html += `
    <div class="grupo-prova">
      <h3>${bimestreSelecionado}</h3>

      <table>
        <thead>
          <tr>
            <th>Avaliação</th>
            <th>Data</th>
            <th>Nota</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
  `;

  avaliacoes.forEach((av) => {
    html += `
      <tr>
        <td>${av.titulo}</td>
        <td>${formatarData(av.dataAvaliacao)}</td>
        <td>${Number(av.nota).toFixed(1).replace(".", ",")}</td>
        <td>${av.observacao || "Sem observação específica."}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  desempenhoDiv.innerHTML = html;
}

function calcularMedia(avaliacoes) {
  if (avaliacoes.length === 0) return "Sem notas";

  const soma = avaliacoes.reduce(
    (total, av) => total + Number(av.nota),
    0
  );

  return (soma / avaliacoes.length).toFixed(2).replace(".", ",");
}

function definirSituacao(media) {
  const valor = Number(String(media).replace(",", "."));

  if (isNaN(valor)) return "Sem situação";
  if (valor >= 7) return "Satisfatório";
  if (valor >= 5) return "Em acompanhamento";
  return "Precisa melhorar";
}

function formatarData(dataISO) {
  if (!dataISO) return "-";

  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}