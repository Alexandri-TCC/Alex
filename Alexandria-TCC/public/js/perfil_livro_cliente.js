import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";



const btnInit = document.getElementById("btnInit");



const imgUsuario = document.getElementById("imgUsuario");
const imgMain = document.getElementById("main-image");
const txtTitulo = document.getElementById("txtTitulo");
const txtUsuario = document.getElementById("txtUsuario");
const txtDesc = document.getElementById("txtDesc");

const pegaObra = async() => {
  const urlPesquisa = new URLSearchParams(window.location.search);
  return urlPesquisa.get("id");
}

const pesquisaInfo = async (isbn) => {
  const livro = await buscaLivroISBN(isbn);
  const titulo = livro.titulo;

  return titulo;
}

const criaImagem = async (imagem, num) => {
  return `<img src="${imagem}" class="img-thumbnail me-2 miniatura" alt="Thumb ${num}" data-image="${imagem}">`
}


const carregaPag = async () => {

    const idObra = await pegaObra();

    
    
    const resultado = await getDoc(doc(banco, "Obra", idObra));
    const titulo = await pesquisaInfo(resultado.data().ISBN);
    const radio = document.querySelector(`input[name="estado"][value="${resultado.data().estado_obra}"]`);
    const imagens = resultado.data().foto_obra;

    

    const dono = resultado.data().id_usu

    const usu1 = await getDoc(doc(banco, "usuarios", dono));
    const usu2 = await getDoc(doc(banco, "usuarios", dono, "perfil", "dados"));

    btnInit.addEventListener("click", () => {
      window.location.href = `chat.html?init=${dono}`;
    });
    
    txtTitulo.innerHTML = titulo;
    txtDesc.innerHTML = resultado.data().descricao_obra;
    radio.checked = true;
    imgMain.src = imagens[0];
    txtUsuario.innerHTML = usu1.data().nome_usu;
    imgUsuario.src = usu2.data().foto_usu;


    const container = document.getElementById("miniaturas");
    container.innerHTML = '';

    for(var i = 0; i < imagens.length; i++) {
      container.innerHTML += await criaImagem(imagens[i], (i + 1));
    }

    const miniaturas = document.querySelectorAll('.miniatura');
   const mainImage = document.getElementById('main-image');
 
   // Adiciona um evento de "mouseover" para cada miniatura
   miniaturas.forEach(miniatura => {
     miniatura.addEventListener('mouseover', function() {
       // Altera a imagem principal para a imagem da miniatura
       const newImage = this.getAttribute('data-image');
       mainImage.src = newImage;
     });
   });
}

//document.querySelector('input[name="editEstado"]:checked').value;

carregaPag();


document.addEventListener("DOMContentLoaded", () => {
    // Redireciona para a página anterior ao clicar no botão com a classe .btn-voltar
    document.querySelector(".btn-voltar").addEventListener("click", () => {
        window.history.back();
    });
});
   // Seleciona todas as miniaturas e a imagem principal
   

