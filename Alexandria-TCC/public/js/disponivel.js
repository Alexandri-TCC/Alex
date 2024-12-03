import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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

const pegaISBN = async() => {
  const urlPesquisa = new URLSearchParams(window.location.search);
  return urlPesquisa.get("isbn");
}

var aISBN = '';
await pegaISBN().then((valor) => {
  aISBN = valor;
});

const pesquisaInfo = async (isbn) => {
  const livro = await buscaLivroISBN(isbn);
  const titulo = livro.titulo;
  const autor = livro.autor

  return [titulo, autor];
} 

const abreLivro = (livro) => {
  window.location.href = `perfil_livro_cliente.html?id=${livro}`;
}

const criaLivro = async (livro) => {
  const nomeDono = await pesquisaDono(livro.id_usu);
  const info = await pesquisaInfo(aISBN);
  
  return `<div class="book-card">
      <h3 class="book-title">${info[0]}</h3>
      <p class="book-author">por ${info[1]}</p>
      <img src="${livro.foto_obra[0]}" alt="Capa do livro" class="book-image">
      <p class="book-user">${nomeDono}</p> 
      <button class="book-button livro-cliente">Mais Detalhes</button>
  </div>`;

};


const pesquisaLivro = async (isbn) => {
  console.log(isbn)
    try {
        const resultado = await getDocs(query(collection(banco, "Obra"), where("ISBN", "==", isbn), where("trocado", "==", false)));

        const livros = [];
        console.log("to");
        resultado.forEach(doc => {
          const nomeDono = doc.data().id_usu;
          if (nomeDono == usuario) {
            
          } else {
            livros.push({id_obra: doc.id, ...doc.data()});
          }
        });
        return livros;
    } catch (error) {
        console.error("Erro ao buscar obras por ISBN:", error);
        return [];
    }
}

const pesquisaDono = async (dono) => {
  try {
    const resultado = await getDoc(doc(banco, "usuarios", dono));
    const nomeDono = resultado.data().nome_usu;
    return nomeDono;
} catch (error) {
    console.error("Erro ao buscar obras por ISBN:", error);
    return [];
}
}

const carregaPag = async () => {
  const container = document.getElementById("bookGrid");
  container.innerHTML = "<p>Carregando Livros...</p>";

  try {
    const livros = await pesquisaLivro(aISBN);

    console.log(livros);
    if (livros.length > 0) {
      const cardsLivro = await Promise.all(livros.map(criaLivro));
      
      container.innerHTML = cardsLivro.join("");
    } else {
      container.innerHTML = "<p>Nenhum livro encontrado.</p>";
    }

    container.querySelectorAll(".book-button").forEach((botao, index) => {
      const titulo = livros[index].id_obra;
      botao.addEventListener("click", () => abreLivro(livros[index].id_obra));
    });
  } catch (e) {
    container.innerHTML = "<p>Erro ao carregar livros. Tente novamente mais tarde.</p>";
  }
}

carregaPag();

