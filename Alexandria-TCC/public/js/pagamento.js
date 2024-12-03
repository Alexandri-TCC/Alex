import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query, updateDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

let usuario

onAuthStateChanged(verificador, (user) => {
    if (user) {
      console.log("Usuário logado:", user.email);
      usuario = user.uid
    } else {
      console.log("Nenhum usuário logado");
      window.location.href = "login.html";
    }
});

const infoMoeda = document.getElementById("infoMoeda");
const infoNivel = document.getElementById("infoNivel");
const infoTotal = document.getElementById("infoTotal");

const quantia = localStorage.getItem("quantiaMoeda")

infoMoeda.textContent = "R$ " + localStorage.getItem("valorMoeda");
infoNivel.textContent = localStorage.getItem("nivelFormato");
infoTotal.textContent = "R$ " + localStorage.getItem("totalMoeda");

const registrarCompra = async () => {
    const resultado = await getDoc(doc(banco, "usuarios", usuario, "perfil", "dados"));

    await addDoc(collection(banco, "Historico_Compras"), {
        id_usu: usuario,
        data_hora: serverTimestamp(),
        valor_moeda: infoTotal.textContent,
        nivel_moeda: resultado.data().nivel_usu,
        quantidade_moedas: quantia
    });

    var valor = Number(resultado.data().moedas_usu) + Number(quantia);

    await updateDoc(doc(banco, "usuarios", usuario, "perfil", "dados"), {
        moedas_usu: valor
    })

    alert("Pagamento realizado, você receberá suas moedas em breve.");
    window.location.href = "../index.html"
}

const criarIntencaoPagamento = async (valor) => {
    const url = "https://api.stripe.com/v1/payment_intents";
    const secretKey = "sk_test_51QRSozAE5jtgFsSasd3ipSp2EDzAlFnKMg9tInag7hZHpBF10wCIe2IgYNleSU0kOtkbctYFQvYPBhFicRWb2hfS000HbHmI4D";

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${secretKey}`,
    };

    const body = new URLSearchParams({
        amount: (valor * 100).toString(),
        currency: "brl",
    });

    body.append("payment_method_types[]", "card");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro: ${response.statusText}, Detalhes: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log("Intenção de pagamento criada:", data);
        return data.client_secret;
    } catch (error) {
        console.error("Erro ao criar intenção de pagamento:", error);
    }
};

const stripe = Stripe('pk_test_51QRSozAE5jtgFsSaOmICdi54yJNv1VmUm7V2ijpLzbJejFjJuAVUJ2zmqYlrboGLmTYFIa8KGfcePpZrUedS1Ybs00v2Ef8iw3');
const elements = stripe.elements();

const cardElement = elements.create('cardNumber');
cardElement.mount('#card-element');

const expiryElement = elements.create('cardExpiry');
expiryElement.mount('#expiry-element');

const cvcElement = elements.create('cardCvc');
cvcElement.mount('#cvc-element');

const processarPagamento = async (event) => {
    event.preventDefault();
    document.getElementById('btn-cadastrar').disabled = true;

    const clientSecret = await criarIntencaoPagamento(50);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
        },
    });

    if (error) {
        console.error('Erro no pagamento:', error.message);
        document.getElementById('payment-message').textContent = `Erro: ${error.message}`;
        document.getElementById('payment-message').style.color = 'red';
    } else {
        console.log('Pagamento realizado com sucesso!', paymentIntent);
        document.getElementById('payment-message').textContent = 'Pagamento aprovado!';
        document.getElementById('payment-message').style.color = 'green';

        setTimeout(registrarCompra, 1000);
    }
    
};



document.getElementById('payment-form').addEventListener('submit', processarPagamento);
document.getElementById('cartao-credito').addEventListener('click', () => {
    document.getElementById("txtDebito").textContent = "Cartão de Crédito"
})
document.getElementById('cartao-debito').addEventListener('click', () => {
    document.getElementById("txtDebito").textContent = "Cartão de Débito"
})