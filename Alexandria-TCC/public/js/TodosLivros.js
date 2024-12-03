import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {banco, verificador} from "./firebase/configuracao.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
onAuthStateChanged(verificador, (user) => {
  if (user) {
    console.log("Usuário logado:", user.email);
  } else {
    console.log("Nenhum usuário logado");
    window.location.href = "login.html";
  }
});

const pegaPesquisa = async() => {
  const urlPesquisa = new URLSearchParams(window.location.search);
  if (!urlPesquisa.get("q")) {
    return "Romance";
  } else {
  return urlPesquisa.get("q");
  }
}


const tituloPesquisa = document.getElementById("tituloPesquisa");


const abrirObra = (obra, titulo, autor) => {
  localStorage.setItem("obraSelecionada", obra);
  localStorage.setItem("obraTitulo", titulo);
  window.location.href = "livro.html";
};

const abrirCadastro = (obra) => {
  window.location.href = `cadastro_livro.html?isbn=${obra}`;
};


const criarObra = (livro) => {
  return `
      <div class="card-livro">
        <h3 class="titulo-livro">${livro.titulo}</h3>
        <p class="autor-livro">por ${livro.autor}</p>
        <img class="imagem-livro" src="${livro.imagem}" alt="Capa Livro">
        <button class="botao-card botao-transparente" info-isbn="${livro.isbn13}" info-titulo="${livro.titulo}">Tenho esse livro</button>
        <button class="botao-card" info-isbn="${livro.isbn13}" info-titulo="${livro.titulo}">Mais Detalhes</button>
      </div>`;
};


const carregarObras = async (pesquisa, containerId, inicio) => {
  const container = document.getElementById(containerId);
  container.innerHTML = "<p>Carregando Livros...</p>";

  try {
    const obras = await buscaLivroTexto(pesquisa, inicio);

    if (obras.length > 0) {
      container.innerHTML = obras.map(criarObra).join("");
    } else {
      container.innerHTML = "<p>Nenhum livro encontrado.</p>";
    }
    
    container.querySelectorAll(".botao-card").forEach((botao) => {
      const isbn = botao.getAttribute("info-isbn");
      const titulo = botao.getAttribute("info-titulo");

      if (botao.classList.contains("botao-transparente")) {
        botao.addEventListener("click", () => abrirCadastro(isbn));
      } else {
        botao.addEventListener("click", () => abrirObra(isbn, titulo));
      }
    });


  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
  }
};



document.getElementById("collapseBtn").addEventListener("click", async () => {
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  if (sidebar && content) {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("collapsed");
  }
})

// Função para alternar a visibilidade do menu de filtros
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filterMenu');

    if (filterMenu) {
        filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
    }
}

// Função para ordenar os livros
function sortBooks(order) {
    const bookGrid = document.getElementById('bookGrid');
    if (bookGrid) {
        const books = Array.from(bookGrid.querySelectorAll('.book-card'));
        books.sort((a, b) => {
            const titleA = a.querySelector('.book-title').textContent.toLowerCase();
            const titleB = b.querySelector('.book-title').textContent.toLowerCase();

            return order === 'a-z'
                ? titleA.localeCompare(titleB)
                : titleB.localeCompare(titleA);
        });

        books.forEach(book => bookGrid.appendChild(book));
    }

    const filterMenu = document.getElementById('filterMenu');
    if (filterMenu) filterMenu.style.display = 'none';
}

// Fecha o menu ao clicar fora
window.addEventListener('click', (e) => {
    const filterMenu = document.getElementById('filterMenu');
    const filterButton = document.querySelector('.filter-button');

    if (filterMenu && filterButton) {
        if (!filterMenu.contains(e.target) && !filterButton.contains(e.target)) {
            filterMenu.style.display = 'none';
        }
    }
});

// Configuração de links do menu lateral
document.addEventListener('DOMContentLoaded', async () => {
    var pesquisa = '';
    await pegaPesquisa().then((valor) => {
      pesquisa = valor;
    });

    tituloPesquisa.innerHTML = pesquisa;
    await carregarObras(pesquisa, "resultado", 0); 



    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            tituloPesquisa.innerHTML = link.textContent;
            carregarObras(link.textContent, "resultado", 0);
        });
    });

    // Configuração de botões de edição
    document.querySelectorAll('.editar').forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = 'perfil_livro_usuario.html';
        });
    });

    // Configuração de botões de detalhes

    // Configuração de botões de "tenho"

    // Botão de voltar
    const btnVoltar = document.querySelector(".btn-voltar");
    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            window.history.back();
        });
    }

    // Configuração do carrossel para múltiplos carrosséis
    document.querySelectorAll('.carrossel-livros').forEach(carrossel => {
        const btnEsquerda = carrossel.querySelector('.button-esquerda');
        const btnDireita = carrossel.querySelector('.button-direita');
        const containerCarrossel = carrossel.querySelector('.container-carrossel');

        if (!btnEsquerda || !btnDireita || !containerCarrossel) return;

        const scrollAmount = containerCarrossel.clientWidth;

        btnEsquerda.addEventListener('click', () => {
            containerCarrossel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth',
            });
        });

        btnDireita.addEventListener('click', () => {
            containerCarrossel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        });

        containerCarrossel.addEventListener('scroll', () => {
            btnEsquerda.disabled = containerCarrossel.scrollLeft === 0;
            btnDireita.disabled =
                containerCarrossel.scrollLeft + containerCarrossel.clientWidth >= containerCarrossel.scrollWidth;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const sidebarList = document.querySelector(".sidebar-list");

  sidebarList.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("sidebar-link")) {
      const activeLink = sidebarList.querySelector(".active");
      if (activeLink) {
        activeLink.classList.remove("active");
        activeLink.removeAttribute("aria-selected");
      }

      const clickedLink = event.target;
      clickedLink.classList.add("active");
      clickedLink.setAttribute("aria-selected", "true");

      const listItem = clickedLink.closest("li");
      sidebarList.prepend(listItem);

      // Rola o menu inteiro para o topo
      sidebarList.scrollTo({
        top: 0, // Garante que o topo da lista esteja visível
        behavior: "smooth" // Rolagem suave
      });
    }
  });
});


