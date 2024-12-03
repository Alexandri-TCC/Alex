import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

let usuario;

onAuthStateChanged(verificador, (user) => {
    if (user) {
      console.log("Usuário logado:", user.email);
      usuario = user.uid
      permitirPainel();
    } else {
      console.log("Nenhum usuário logado");
      window.location.href = "login.html";
    }
});

function formatarNumero(valor) {
  return valor.toFixed(2).replace('.', ',');
}

const permitirPainel = async () => {
    const resultado = await getDoc(doc(banco, "usuarios", usuario, "perfil", "dados"));
    const nivel = resultado.data().nivel_usu
    const compraRef = "compraN" + nivel
    const compraPermitida = document.getElementById(compraRef)
    
    compraPermitida.classList.remove('desabilitada')
    const botaoCompra = await compraPermitida.querySelector('.comprar-button');
    

    var val1; var val3; var val5; var pagamento;

    if (nivel == 1) {
      val1 = 9.50;
      val3 = 27.00;
      val5 = 45.00;
    } else if (nivel == 2) {
      val1 = 8.55
      val3 = 24.30
      val5 = 40.50
    } else if (nivel == 3) {
      val1 = 7.60
      val3 = 21.60
      val5 = 36.00
    } else if (nivel == 4) {
      val1 = 6.65
      val3 = 18.90
      val5 = 31.50
    } else {
      return
    }

    botaoCompra.addEventListener("click", () => {
      var quantiaMoeda = compraPermitida.querySelector('.numMoedas').textContent;

      if (quantiaMoeda == 3) {
        pagamento = val3
      } else if (quantiaMoeda == 5) {
        pagamento = val5
      } else {
        pagamento = quantiaMoeda * val1
      }

      val1 = formatarNumero(val1);
      pagamento = formatarNumero(pagamento);

      var nivelFormato = "Leitor nivel " + nivel;
      localStorage.setItem("nivelFormato", nivelFormato);
      localStorage.setItem("valorMoeda", val1);
      localStorage.setItem("totalMoeda", pagamento);
      localStorage.setItem("quantiaMoeda", quantiaMoeda);

      window.location.href = "pagamento.html";
    })
}

