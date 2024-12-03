import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {banco, verificador} from "./firebase/configuracao.js";
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";



const formPesquisa = document.getElementById("formPesquisa");
const inpPesquisa = document.getElementById("inpPesquisa");


const pesquisaObra = async(pesquisa) => {
  const valor = pesquisa;
  window.location.href = `./pages/TodosLivros.html?q=${encodeURIComponent(valor)}`;
}

formPesquisa.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pesquisa = inpPesquisa.value;

  pesquisaObra(pesquisa);
});


const abrirObra = (obra, titulo, autor) => {
  localStorage.setItem("obraSelecionada", obra);
  localStorage.setItem("obraTitulo", titulo);
  window.location.href = "./pages/livro.html";
};


const criarObra = (livro) => {
  return `
  <div class="content">
      <img class="img-livros" src="${livro.imagem}" alt="${livro.titulo}">
      <h3>${livro.titulo}</h3>
      <p class="p-card">${livro.sinopse}</p>
      <button class="button-card-livros">Mais Detalhes</button>
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

    container.querySelectorAll(".button-card-livros").forEach((botao, index) => {
      const isbn = obras[index].isbn13;
      const titulo = obras[index].titulo;
      botao.addEventListener("click", () => abrirObra(isbn, titulo));
      console.log(obras[index].titulo + ": ISBN " + obras[index].isbn13)
    });
  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
  }
};





document.addEventListener('DOMContentLoaded', async () => {

  await carregarObras("Ficção", "containerDestaque", 0);
  await carregarObras("Mistério", "containerSugestao", 0);
  await carregarObras("Historinha", "containerInfantil", 0);
  await carregarObras('Romance', "containerRomance", 0);


  const setupSliders = () => {
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
      const container = slider.querySelector('.container-total-card');
      const prevButton = slider.querySelector('.button-esquerda');
      const nextButton = slider.querySelector('.button-direita');

      if (prevButton && nextButton) {
        // Verificao do elemento, antes de acessar suas propriedades
        const cardContent = document.querySelector('.content');
        if (cardContent) {
          const cardWidth = cardContent.offsetWidth;
          const gap = 18; // Espaço entre os cards
          const scrollAmount = (cardWidth + gap) * 5; // Rola 5 cards de uma vez

          prevButton.addEventListener('click', () => {
            container.scrollBy({
              left: -1165,
              behavior: 'smooth'
            });
          });

          nextButton.addEventListener('click', () => {
            container.scrollBy({
              left: 1165,
              behavior: 'smooth'
            });
          });
        } else {
          console.error("Elemento '.content' não encontrado.");
        }
      } else {
        console.error('Botões de navegação não encontrados.');
      }

      setupCategoryCarousel(container, nextButton);
    });
  };

  // Função para o carrossel de categorias
  const setupCategoryCarousel = (varContainer, varNextButton) => {
   
    if (varContainer && varNextButton) {
      let scrollAmount = 0; // Quantidade atual de rolagem

      // Verificao do elemento, antes de acessar suas propriedades
      const card = document.querySelector('.container-total-card');
      if (card) {
        const cardWidth = card.offsetWidth;
        const gap = 20; // Espaço entre os cards
        const visibleCards = 4; // Número de cards visíveis na tela
        const scrollStep = (cardWidth + gap) * visibleCards;

        varNextButton.addEventListener('click', () => {
          // Calcula a nova posição de rolagem
          scrollAmount += scrollStep;
          varContainer.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        });
      } else {
        console.error("Elemento '.container-total-card' não encontrado.");
      }
    } else {
      console.error("Elemento '.container-total-card' ou '.button-categoria' não encontrado.");
    }
  };










  // eventos do formulário de login
  const setupLoginForm = () => {
    // link "Esqueci minha senha"
    const linkEsqueciSenha = document.getElementById('link-esqueci-senha');
    if (linkEsqueciSenha) {
      linkEsqueciSenha.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link

        // Oculta o container de login
        const loginContainer = document.querySelector('.container-login');
        const forgotPasswordContainer = document.querySelector('.container-login-esqueci-senha');
        
        if (loginContainer && forgotPasswordContainer) {
          loginContainer.style.display = 'none';
          forgotPasswordContainer.style.display = 'block';
        }
      });
    }









    // link "Não tenho conta"
    const linkCadastrar = document.getElementById('link-cadastrar');
    if (linkCadastrar) {
      linkCadastrar.addEventListener('click', function(event) {
        event.preventDefault(); // Previne o comportamento padrão do link

        // Oculta o container de login e o container de redefinição de senha
        const loginContainer = document.querySelector('.container-login');
        const forgotPasswordContainer = document.querySelector('.container-login-esqueci-senha');
        const registerContainer = document.querySelector('.container-cadastro');
        
        if (loginContainer && forgotPasswordContainer && registerContainer) {
          loginContainer.style.display = 'none';
          forgotPasswordContainer.style.display = 'none';
          registerContainer.style.display = 'block';
        }
      });
    }
  };

  // ícone do usuário
  const usuarioIcon = document.getElementById('usuario-icon');
  if (usuarioIcon) {
    usuarioIcon.addEventListener('click', function(event) {
      event.preventDefault(); // Previne o comportamento padrão do link

      const sumirLogin = document.querySelector('.sumir-login');
      const loginContainer = document.querySelector('.container-login');
      const forgotPasswordContainer = document.querySelector('.container-login-esqueci-senha');
      const registerContainer = document.querySelector('.container-cadastro');

      if (sumirLogin && loginContainer) {
        sumirLogin.style.display = 'none';
        loginContainer.style.display = 'block';

        if (forgotPasswordContainer) {
          forgotPasswordContainer.style.display = 'none';
        }

        if (registerContainer) {
          registerContainer.style.display = 'none';
        }
      }
    });
  }

  // Inicia todas as funcionalidades
  setupSliders();
  setupLoginForm();

});


 


