import {banco, verificador} from "./firebase/configuracao.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";


onAuthStateChanged(verificador, (user) => {
  console.log(user);
  if (!user) {
      btnPerfil.href = `pages/login.html`;
  } else {
      btnPerfil.href = `pages/perfil.html`;
  }
});

const btnPerfil = document.getElementById("btnPerfil");

