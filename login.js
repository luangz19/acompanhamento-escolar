import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const form = document.getElementById("loginForm");
const erro = document.getElementById("erro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const credencial = await signInWithEmailAndPassword(auth, email, senha);
    const uid = credencial.user.uid;
    const usuarioSnap = await getDoc(doc(db, "usuarios", uid));

    if (!usuarioSnap.exists()) {
      erro.textContent = "Usuário sem perfil cadastrado no sistema.";
      return;
    }

    const usuario = usuarioSnap.data();

    localStorage.setItem("usuarioNome", usuario.nome);
    localStorage.setItem("usuarioTipo", usuario.tipo);
    localStorage.setItem("usuarioUid", uid);

    window.location.href = usuario.tipo === "professor" ? "professor.html" : "pais.html";
  } catch (error) {
    erro.textContent = "E-mail ou senha incorretos.";
    console.error(error);
  }
});
