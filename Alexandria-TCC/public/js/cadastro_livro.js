import {banco, verificador} from "./firebase/configuracao.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 

const inpIsbn = document.getElementById("isbn");
const inpDescricao = document.getElementById("descricao");
const inpEstado = document.getElementById("estado");
const inpFoto = document.getElementById("upload-foto");
const btnCadastrar = document.querySelector(".cadastrar-btn");

let usuarioLogado = null;

function validateImageCount(event) {
    const files = event.target.files;
    if (files.length > 3) {
      alert("Você pode selecionar no máximo 3 imagens.");
      event.target.value = "";
    }
  };

onAuthStateChanged(verificador, (user) => {
    if (user) {
      console.log("Usuário logado:", user.email);
      usuarioLogado = user;
    } else {
      console.log("Nenhum usuário logado");
      window.location.href = "login.html";
    }
});

const pesquisaObra = async () => {
    inpIsbn.placeholder = "Carregando..."
    const urlPesquisa = new URLSearchParams(window.location.search);
    return urlPesquisa.get("isbn");
}

const carregaPag = async () => {
    const isbn = await pesquisaObra();
    const livro = await buscaLivroISBN(isbn);
    const titulo = livro.titulo;
    const autor = livro.autor;

    inpIsbn.value = titulo + ". Por " + autor;
}


inpFoto.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 3) {
      alert("Você pode selecionar no máximo 3 imagens.");
      event.target.value = "";
    }
})

btnCadastrar.addEventListener("click", async () => {
    btnCadastrar.disabled = true;
    try {
        
        const isbnVal = await pesquisaObra();
        const isbn = inpIsbn.value.trim();
        const descricao = inpDescricao.value.trim();
        const estado = inpEstado.value;
        const foto = inpFoto.files;

        console.log(inpFoto.files[0]);

        if (!isbn || !descricao || !estado || !foto) {
            alert("Preencha todos os campos e selecione uma foto!");
            return;
        }

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
        if (fileUrl.length == foto.length) {
            await addDoc(collection(banco, "Obra"), {
                id_usu: usuarioLogado.uid,
                ISBN: isbnVal,
                foto_obra: fileUrl,
                descricao_obra: descricao,
                estado_obra: estado,
                trocado: false,
            });

            alert("Livro cadastrado com sucesso!");
        } else {
            console.error("Erro ao enviar imagem:", data.error.message);
            alert(`Erro ao enviar imagem: ${data.error.message}`);
        }


    } catch (error) {
        console.error("Erro ao cadastrar o livro:", error);
        alert("Erro ao cadastrar o livro. Tente novamente.");
    }
    btnCadastrar.disabled = false;
});

carregaPag();

document.addEventListener('DOMContentLoaded', () => {
    
    
    const hiddenElements = document.querySelectorAll('.animacao');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aparecer');
            } else {
                entry.target.classList.remove('aparecer');
            }
        });
    }, { threshold: 0.1 });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });
});
 // Função para mostrar as imagens selecionadas dentro do campo de input
 function previewImages(event) {
    const input = event.target;
    const files = input.files;

    // Limita a seleção de imagens a no máximo 3
    if (files.length > 3) {
      alert('Você pode selecionar no máximo 3 imagens.');
      input.value = ""; // Limpa o campo caso exceda o limite
      return;
    }

    const previewContainer = document.getElementById('image-preview');
    const imageNamesContainer = document.getElementById('image-names');
    previewContainer.innerHTML = ''; // Limpa as imagens anteriores
    imageNamesContainer.innerHTML = ''; // Limpa os nomes anteriores

    let currentIndex = 0;

    // Exibe as miniaturas das imagens dentro do input
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.position = 'absolute';
        img.style.width = '100%'; // Faz com que a imagem ocupe toda a largura do campo de input
        img.style.height = '100%'; // Faz com que a imagem ocupe toda a altura do campo de input
        img.style.objectFit = 'cover'; // Assegura que a imagem será cortada proporcionalmente
        img.style.transition = 'opacity 1s ease-in-out';
        img.style.opacity = '0'; // Começa invisível

        previewContainer.appendChild(img);

        // Adiciona o nome da imagem abaixo do input
        const name = document.createElement('p');
        name.textContent = files[i].name; // Nome do arquivo
        imageNamesContainer.appendChild(name);
        
        // Aguardar a imagem carregar para aplicar a alternância
        setTimeout(() => {
          img.style.opacity = '1'; // Torna a imagem visível
        }, 10);
      };
      reader.readAsDataURL(files[i]);
    }

    // Alterna entre as imagens a cada 3 segundos
    setInterval(function() {
      const images = previewContainer.querySelectorAll('img');
      images.forEach((img, index) => {
        img.style.opacity = (index === currentIndex) ? '1' : '0'; // Alterna a opacidade
      });
      currentIndex = (currentIndex + 1) % files.length; // Ciclo entre as imagens
    }, 3000); // Altera a imagem a cada 3 segundos
  }
