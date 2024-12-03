const formPesquisa = document.getElementById("formPesquisa");
const inpPesquisa = document.getElementById("inpPesquisa");


const pesquisaObra = async(pesquisa) => {
  const valor = pesquisa;
  window.location.href = `TodosLivros.html?q=${encodeURIComponent(valor)}`;
}

formPesquisa.addEventListener("submit", async (event) => {
  event.preventDefault();
  const pesquisa = inpPesquisa.value;

  pesquisaObra(pesquisa);
});