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

const abrirObra = (obra, titulo, autor) => {
  localStorage.setItem("obraSelecionada", obra);
  localStorage.setItem("obraTitulo", titulo);
  window.location.href = "livro.html";
};

const abrirCadastro = (obra) => {
  window.location.href = `cadastro_livro.html?isbn=${obra}`;
};

const pesquisaLivros = async () => {
    const resultado = await getDocs(query(collection(doc(banco, "usuarios", usuario), "estante")));
    const livros = [];
    if (resultado.empty) {
      return '';
    } else {
      resultado.forEach( doc => {
        if (doc.data().categoria == 'A') {
          livros.push(doc.data().ISBN);
        }
      });
      return livros;
    }
}


const pesquisaObra = async (isbn) => {
  const container = document.getElementById("bookGrid");

  const obras = await buscaLivroISBN(isbn);
  
  container.innerHTML += `<div class="book-card">
              <h3 class="book-title">${obras.titulo}</h3>
              <p class="book-author">por ${obras.autor}</p>
              <img class="book-image" src="${obras.imagem}">
              <button class="book-button book-button-secondary tenho" info-isbn="${obras.isbn13}" info-titulo="${obras.titulo}">Tenho este livro</button>
              <button class="book-button detalhes" info-isbn="${obras.isbn13}" info-titulo="${obras.titulo}">Mais Detalhes</button>
            </div>`;
}

const carregaPag = async () => {
    await verificaUsuario();

    const container = document.getElementById("bookGrid");
    
    container.innerHTML = "<p>Carregando Livros...</p>";


    try {
        const livros = await pesquisaLivros();

        if (livros.length > 0) {
        container.innerHTML = "";
        await Promise.all(livros.map(livro => pesquisaObra(livro)));

        container.querySelectorAll(".book-button").forEach((botao) => {
          const isbn = botao.getAttribute("info-isbn");
          const titulo = botao.getAttribute("info-titulo");
    
          if (botao.classList.contains("tenho")) {
            botao.addEventListener("click", () => abrirCadastro(isbn));
          } else {
            botao.addEventListener("click", () => abrirObra(isbn, titulo));
          }
        });
      } else {
        container.innerHTML = "Não há livros Desejados."
      }

    } catch (e) {
        console.log(e);
        container.innerHTML = "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
    }
}

carregaPag();

