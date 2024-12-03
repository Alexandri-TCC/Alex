import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail}
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

let usuario;

const verificaUsuario = async () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(verificador, (user) => {
        if (user) {
          console.log("Usuário logado:", user.email);
          usuario = user.uid;
          resolve(usuario);
        } else {
          console.log("Nenhum usuário logado");
          window.location.href = "login.html";
          reject("Usuário não logado");
        }
      });
    });
};

const abreLivro = (livro) => {
    window.location.href = `perfil_livro_usuario.html?id=${livro}`;
}

const criaLivro = async (livro) => {
    const info = await pesquisaInfo(livro.ISBN);

    return `<div class="book-card">
              <h3 class="book-title">${info[0]}</h3>
              <p class="book-author">por ${info[1]}</p>
              <img class="book-image" src="${livro.foto_obra[0]}">
              <p class="p-card">Estado do Livro: <strong>${livro.estado_obra}</strong></p>
              <button class="book-button editar">Mais Detalhes</button>
            </div>`;
}

const pesquisaLivros = async (dono) => {
    const resultado = await getDocs(query(collection(banco, "Obra"), where("id_usu", "==", dono), where("trocado", "==", false)));

    if (resultado.empty) {
        console.log("Sem livros")
        return '';
    } else {
        const livros = [];
        resultado.forEach(doc => {
          livros.push({id_obra: doc.id, ...doc.data()});
        });
        return livros;
    }
}

const pesquisaInfo = async (isbn) => {
    const livro = await buscaLivroISBN(isbn);
    const titulo = livro.titulo;
    const autor = livro.autor
  
    return [titulo, autor];
}


const carregaPag = async () => {
    await verificaUsuario();

    const container = document.getElementById("bookGrid");
    
    container.innerHTML = "<p>Carregando Livros...</p>";

    try {
        const livros = await pesquisaLivros(usuario);

        if (livros.length > 0) {
        const cardsLivro = await Promise.all(livros.map(criaLivro));
        container.innerHTML = cardsLivro.join("");
        } else {
        container.innerHTML = "<p>Nenhum livro encontrado.</p>";
        }

        container.querySelectorAll(".book-button").forEach((botao, index) => {
        botao.addEventListener("click", () => abreLivro(livros[index].id_obra));
        });
    } catch (e) {
        console.log(e);
        container.innerHTML = "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
    }
}

carregaPag();
