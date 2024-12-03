import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query, deleteDoc }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

onAuthStateChanged(verificador, (user) => {
  if (user) {
    console.log("Usuário logado:", user.email);
  } else {
    console.log("Nenhum usuário logado");
    window.location.href = "login.html";
  }
});


const imgMain = document.getElementById("main-image");
const txtTitulo = document.getElementById("txtTitulo");
const txtDesc = document.getElementById("txtDesc");
const editForm = document.getElementById("editForm"); 
const editDesc = document.getElementById("editDescription");
const inpFoto = document.getElementById("editImages");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const btnEditar = document.getElementById("btnEditar");
const btnExcluir = document.getElementById("btnExcluir");

btnExcluir.disabled = true;


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

const uploadImagem = async (foto) => {
  const fileUrl = [];

        for (var i = 0; i < foto.length; i++) {
            const fileType = foto[i].type;
            if (!fileType.startsWith("image/")) {
                alert("Por favor, selecione um arquivo de imagem válido (JPG, JPEG ou PNG).");
                return;
            }

            const formData = new FormData();
            formData.append("file", foto[i]);
            formData.append("upload_preset", "ml_default");

            console.log("Enviando imagem para o Cloudinary...");

            const response = await fetch("https://api.cloudinary.com/v1_1/dwxftry8e/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Resposta do Cloudinary:", data);

            if (response.ok) {
                fileUrl[i] = data.secure_url;
                console.log("Imagem carregada com sucesso:", fileUrl[i]);
            }
        }

    return fileUrl;
}

const carregaPag = async () => {
    const idObra = await pegaObra();
    const resultado = await getDoc(doc(banco, "Obra", idObra));
    const titulo = await pesquisaInfo(resultado.data().ISBN);
    const radio = document.querySelector(`input[name="estado"][value="${resultado.data().estado_obra}"]`);
    const imagens = resultado.data().foto_obra;
    
    txtTitulo.innerHTML = titulo;
    txtDesc.innerHTML = resultado.data().descricao_obra;
    editDesc.textContent = txtDesc.textContent;
    radio.checked = true;
    imgMain.src = imagens[0];

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

    btnEditar.style.display = "block";
    btnExcluir.disabled = false;
}

//document.querySelector('input[name="editEstado"]:checked').value;

carregaPag();

inpFoto.addEventListener("change", (event) => {
  const files = event.target.files;
  if (files.length > 3) {
    alert("Você pode selecionar no máximo 3 imagens.");
    event.target.value = "";
  }
});

editForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  btnSalvar.disabled = true;
  btnCancelar.disabled = true;

  const idObra = await pegaObra();
  const resultado = await getDoc(doc(banco, "Obra", idObra));
  const radio = document.querySelector('input[name="editEstado"]:checked').value;
  const fileUrl = await uploadImagem(inpFoto.files);

  await setDoc(doc(banco, "Obra", idObra), {
    ISBN: resultado.data().ISBN,
    estado_obra: radio,
    descricao_obra: editDesc.value,
    foto_obra: fileUrl,
    id_usu: resultado.data().id_usu,
    trocado: false,
  });

  alert ("Informações editadas com sucesso.");
  window.location.href = `perfil_livro_usuario.html?id=${idObra}`;
});


btnExcluir.addEventListener("click", async () => {
  const confirmar = confirm("Você tem certeza que deseja excluir esse livro?");
  btnExcluir.disabled = true;
  if (confirmar) {
      const idObra = await pegaObra();
      await deleteDoc(doc(banco, "Obra", idObra));
      alert("Você excluir esse livro.");
      window.location.href = "perfil.html";

  } else {
      console.log("O usuário decidiu não excluir.");
  }
  btnExcluir.disabled = false;
})


document.addEventListener("DOMContentLoaded", () => {
    // Redireciona para a página anterior ao clicar no botão com a classe .btn-voltar
    document.querySelector(".btn-voltar").addEventListener("click", () => {
        window.history.back();
    });
});
   // Seleciona todas as miniaturas e a imagem principal
   

