import {buscaLivroISBN, buscaLivroISBN2, buscaLivroTexto} from "./firebase/configLivro.js";
import {banco, verificador} from "./firebase/configuracao.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, where, query, updateDoc, serverTimestamp, deleteDoc }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail}
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const txtTituloObra = document.getElementById("txtTituloObra");
const txtAutorObra = document.getElementById("txtAutorObra");
const txtDescObra = document.getElementById("txtDescObra");
const txtEditObra = document.getElementById("txtEditObra");
const txtPagsObra = document.getElementById("txtPagsObra");
const txtI13Obra = document.getElementById("txtI13Obra");
const imgObra = document.getElementById("main-image");
const btnTrocar = document.getElementById("btnTrocar");
const btnCadastrar = document.getElementById("btnCadastrar");
const txtQuantia = document.getElementById("txtQuantia");
let gIsbn = '';


const botaoCoracao = document.querySelector("#botao-coracao");
const botaoLivro = document.querySelector("#botao-livro");

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

verificaUsuario();

const carregaPag = async () => {
    const isbn = localStorage.getItem("obraSelecionada");
    const tituloOriginal = localStorage.getItem("obraTitulo");
    const obras = await buscaLivroISBN(isbn);
    const quantia = await getDocs(query(collection(banco, "Obra"), where("ISBN", "==", isbn), where("trocado", "==", false)));

    if (obras.titulo == tituloOriginal) {
        console.log(obras.titulo + " == " + tituloOriginal);
        txtTituloObra.innerHTML = obras.titulo;
        txtAutorObra.innerHTML = obras.autor;
        txtDescObra.innerHTML = obras.sinopse;
        txtEditObra.innerHTML += obras.editora;
        txtPagsObra.innerHTML += obras.paginas;
        txtI13Obra.innerHTML += obras.isbn13;
        imgObra.src = obras.imagem;
        gIsbn = obras.isbn13;
    } else if (obras.titulo != tituloOriginal){
        var obraNova = await buscaLivroISBN2(tituloOriginal);

        txtTituloObra.innerHTML = obraNova.titulo;
        txtAutorObra.innerHTML = obraNova.autor;
        txtDescObra.innerHTML = obraNova.sinopse;
        txtEditObra.innerHTML += obraNova.editora;
        txtPagsObra.innerHTML += obraNova.paginas;
        txtI13Obra.innerHTML += obraNova.isbn13;
        imgObra.src = obraNova.imagem;
        gIsbn = obraNova.isbn13;
    }

  
 
    const estante = await getDocs(query(collection(doc(banco, "usuarios", usuario), "estante"), where("ISBN", "==", isbn), where("trocado", "==", false)));
    if(!estante.empty) {
        if (estante.docs[0].data().categoria == 'B') {
            botaoCoracao.disabled = true;
            const img = botaoLivro.querySelector("img");
            img.src = "../img/Icones/livro_ativo.png";
            
        } else if (estante.docs[0].data().categoria == 'A') {
            botaoLivro.disabled = true;
            const img = botaoCoracao.querySelector("img");
            img.src = "../img/Icones/coracao_ativo.png";
        }
    }

    txtQuantia.innerHTML = quantia.docs.length + " disponíveis para trocar";

    
};

carregaPag();

btnTrocar.addEventListener("click", () => {
    
    window.location.href = `livro_disponivel.html?isbn=${gIsbn}`;
});

btnCadastrar.addEventListener("click", () => {
    window.location.href = `cadastro_livro.html?isbn=${gIsbn}`;
});



document.addEventListener("DOMContentLoaded", function () {
  

  botaoCoracao.addEventListener("click", async function () {
      const isbn = localStorage.getItem("obraSelecionada");
      const estanteRef = doc(collection(doc(banco, "usuarios", usuario), "estante"), isbn);
  
      this.disabled = true;
      const imgCoracao = this.querySelector("img");
      const isAtivo = imgCoracao.src.includes("coracao_ativo");
  
      try {
          if (isAtivo) {
              await deleteDoc(estanteRef);
              imgCoracao.src = "../img/Icones/coracao_desativado.png";
              botaoLivro.disabled = false;
          } else {
            botaoLivro.disabled = true;
              await setDoc(estanteRef, {
                  ISBN: isbn,
                  categoria: "A",
              });
              imgCoracao.src = "../img/Icones/coracao_ativo.png";
          }
      } catch (error) {
          console.error("Erro ao atualizar estante:", error);
          alert("Ocorreu um erro. Tente novamente.");
      } finally {
          this.disabled = false;
      }
  });

  botaoLivro.addEventListener("click", async function () {
    const isbn = localStorage.getItem("obraSelecionada");
    const estanteRef = doc(collection(doc(banco, "usuarios", usuario), "estante"), isbn);

    this.disabled = true;
    const imgLivro = this.querySelector("img");
    const isAtivo = imgLivro.src.includes("livro_ativo");

    try {
        if (isAtivo) {
            await deleteDoc(estanteRef);
            imgLivro.src = "../img/Icones/livro_desativado.png";
            botaoCoracao.disabled = false;
        } else {
            botaoCoracao.disabled = true;
            await setDoc(estanteRef, {
                ISBN: isbn,
                categoria: "B",
            });
            imgLivro.src = "../img/Icones/livro_ativo.png";
        }
    } catch (error) {
        console.error("Erro ao atualizar estante:", error);
        alert("Ocorreu um erro. Tente novamente.");
    } finally {
        this.disabled = false;
    }
});
  

  // Adiciona evento de clique para o botão de livro
  botaoLivro.addEventListener("click", function () {
    const isbn = localStorage.getItem("obraSelecionada");
      this.disabled = true;
      const imgLivro = this.querySelector("img");
      const isAtivo = imgLivro.src.includes("livro_ativo");

      if (isAtivo) {
          imgLivro.src = "../img/Icones/livro_desativado.png"; // Troca para desativado
      } else {
          imgLivro.src = "../img/Icones/livro_ativo.png"; // Troca para ativo
      }
      this.disabled = false;
  });
});

// Seleciona a imagem principal
const mainImage = document.getElementById('main-image');

// Seleciona todas as miniaturas
const miniaturas = document.querySelectorAll('.miniatura');

// Adiciona um evento de "mouseover" para cada miniatura
miniaturas.forEach(miniatura => {
    miniatura.addEventListener('mouseenter', function() {
        // Troca a imagem principal pela imagem da miniatura
        const novaImagem = this.getAttribute('data-image');
        mainImage.src = novaImagem;
    });
});

var stars = document.querySelectorAll('.star-icon');
                  

document.addEventListener("DOMContentLoaded", () => {
    // Redireciona para a página anterior ao clicar no botão com a classe .btn-voltar
    document.querySelector(".btn-voltar").addEventListener("click", () => {
        window.history.back();
    });
});

