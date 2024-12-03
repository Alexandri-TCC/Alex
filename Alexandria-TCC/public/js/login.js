import {banco, verificador} from "./firebase/configuracao.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, where, query }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail}
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

document.getElementById("formLogin").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email-login").value;
    const senha = document.getElementById("password").value;

    try {
        const usuAut = await signInWithEmailAndPassword(verificador, email, senha);

        if (usuAut.user.emailVerified) {
            window.location.href = "../index.html";
        } else {
            alert("Por favor, verifique seu email antes de acessar.");
        }
    } catch (e) {
        if (e.message == "Firebase: Error (auth/invalid-login-credentials).") {
            alert("Email e/ou Senha inválidos.")
        } else {
            alert("Erro ao realizar login: " + e.message);
        }
    }
});

// Função para alternar a visibilidade da senha
function togglePasswordVisibility(passwordFieldId, toggleIconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(toggleIconId);

    // Alterna o tipo do campo (password/text)
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Alterna o ícone do olho (mostrar/ocultar)
    toggleIcon.classList.toggle('fa-eye-slash');
}

// Evento para o campo de senha no login
document.getElementById('toggle-password').addEventListener('click', function () {
    togglePasswordVisibility('password', 'toggle-password');
});

// Evento para o campo de senha no cadastro
document.getElementById('toggle-password-cadastro').addEventListener('click', function () {
    togglePasswordVisibility('password-cadastro', 'toggle-password-cadastro');
});

// Evento para o campo de confirmar senha no cadastro
document.getElementById('toggle-confirm-password-cadastro').addEventListener('click', function () {
    togglePasswordVisibility('confirm-password-cadastro', 'toggle-confirm-password-cadastro');
});



const existeEmail = async (xEmail) => {
    const Ref = collection(banco, "usuarios");
    console.log(xEmail);
    try {
        const resultado = await getDocs(query(Ref, where("email_usu", "==", xEmail)));
        console.log(resultado);
        if (resultado.empty) {
            return false;
        } else {
            return true;
        }
    } catch (e) {
        return false;
    }
};

document.getElementById("formCadastro").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("senha").value;
    const Csenha = document.getElementById("confirmar_senha").value;
    const tipo_documento = document.querySelector('input[name="tipo-pessoa"]:checked').value;
    const documento = document.getElementById("documento").value;
    const cidade = document.getElementById("cidade").value;

console.log(tipo_documento + " e " + documento);

    if (senha != Csenha) {
        alert("As senhas não estão correspondentes.");
    } else if (await existeEmail(email) == true) {
        alert("Email indisponível.");
    } else {
        try {
            const usuAut = await createUserWithEmailAndPassword(verificador, email, senha);
            const usuID = usuAut.user.uid;
    
            await sendEmailVerification(verificador.currentUser);

            await setDoc(doc(banco, "usuarios", usuID), {
                nome_usu: nome,
                email_usu: email,
                tipo_usu: tipo_documento,
                documento_usu: documento,
                cidade_usu: cidade
            });
            await setDoc(doc(banco, "usuarios", usuID, "perfil", "dados"), {
                foto_usu: "https://res.cloudinary.com/dwxftry8e/image/upload/v1732596135/Profile_avatar_placeholder_large_mluyfh.png",
                moedas_usu: 0,
                nivel_usu: 1
            });
            
            alert("Cadastro Realizado! Enviamos um link de confirmação ao seu email.");
        } catch (e) {
            if (e == "FirebaseError: Firebase: Error (auth/weak-password).") {
                alert("Por favor escolha uma senha mais forte.")
            } else {
                alert("Erro ao cadastrar: " + e);
            }
        }
    }
    
});





document.getElementById("formEsquece").addEventListener("submit", async (event) => {
    event.preventDefault()
    const email = document.getElementById("email-redefinir").value;

    try {
        await sendPasswordResetEmail(verificador, email);
        alert("Email de redefinição enviado ao seu Email.");
    } catch (e) {
        alert("Não foi possivel enviar o email: "+ e);
    }
});






document.addEventListener('DOMContentLoaded', () => {
    // Alternar para tela de "Esqueci minha senha"
    const linkEsqueciSenha = document.getElementById('link-esqueci-senha');
    if (linkEsqueciSenha) {
        linkEsqueciSenha.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector('.container-login').style.display = 'none';
            document.querySelector('.container-login-esqueci-senha').style.display = 'block';
        });
    }

    // Alternar para tela de "Cadastro"
    const linkCadastrar = document.getElementById('link-cadastrar');
    if (linkCadastrar) {
        linkCadastrar.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector('.container-login').style.display = 'none';
            document.querySelector('.container-login-esqueci-senha').style.display = 'none';
            document.querySelector('.container-cadastro').style.display = 'block';
        });
    }

    // Botão "Voltar" na tela de "Esqueci minha senha"
    const btnVoltarEsqueciSenha = document.querySelector('.container-login-esqueci-senha .btn-voltar');
    if (btnVoltarEsqueciSenha) {
        btnVoltarEsqueciSenha.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector('.container-login-esqueci-senha').style.display = 'none';
            document.querySelector('.container-login').style.display = 'block';
        });
    }

    // Botão "Voltar" na tela de "Cadastro"
    const btnVoltarCadastro = document.querySelector('.container-cadastro .btn-voltar');
    if (btnVoltarCadastro) {
        btnVoltarCadastro.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelector('.container-cadastro').style.display = 'none';
            document.querySelector('.container-login').style.display = 'block';
        });
    }

    // Função para alternar entre CPF e CNPJ dependendo do tipo de pessoa
    function togglePessoa() {
        const tipoPessoa = document.querySelector('input[name="tipo-pessoa"]:checked')?.value;
        
        const cpfField = document.getElementById("cpf-fisico");
        const cnpjField = document.getElementById("cnpj-juridico");
    
        if (!cpfField || !cnpjField) {
            console.error('Elementos CPF ou CNPJ não encontrados no DOM.');
            return; // Evita que o restante da função seja executado
        }
    
        if (tipoPessoa === "fisica") {
            cpfField.style.display = "block";
            cpfField.required = true;
            cnpjField.style.display = "none";
            cnpjField.required = false;
            cnpjField.value = "";
        } else if (tipoPessoa === "juridica") {
            cnpjField.style.display = "block";
            cnpjField.required = true;
            cpfField.style.display = "none";
            cpfField.required = false;
            cpfField.value = "";
        } else {
            cpfField.style.display = "none";
            cnpjField.style.display = "none";
            cpfField.required = false;
            cnpjField.required = false;
        }
    }
    
});
// Função para exibir ou ocultar o campo de CPF ou CNPJ com base na seleção
function toggleDocumento(show) {
    const documentoContainer = document.getElementById('documento-container');
    const documentoField = document.getElementById('documento');
    if (show) {
        documentoContainer.style.display = 'block'; // Exibe o campo de documento
        documentoField.setAttribute('required', 'required'); // Torna obrigatório
    } else {
        documentoContainer.style.display = 'none'; // Oculta o campo de documento
        documentoField.removeAttribute('required'); // Remove a obrigatoriedade
        documentoField.value = ''; // Limpa o campo
    }
}

// Função para formatar CPF ou CNPJ e garantir que só aceitem números
function formatarDocumento() {
    const documento = document.getElementById('documento');
    let valor = documento.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    
    // Limitar o tamanho do CPF ou CNPJ
    const tipoPessoa = document.querySelector('input[name="tipo-pessoa"]:checked').value;

    if (tipoPessoa === 'fisica' && valor.length > 11) {
        valor = valor.substring(0, 11);
    } else if (tipoPessoa === 'juridica' && valor.length > 14) {
        valor = valor.substring(0, 14);
    }

    // Formatar CPF
    if (tipoPessoa === 'fisica') {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    // Formatar CNPJ
    if (tipoPessoa === 'juridica') {
        valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }

    documento.value = valor; // Atualiza o valor do campo com a formatação correta
}

// Função para garantir que o campo só aceite números
function apenasNumeros(event) {
    const input = event.target;
    input.value = input.value.replace(/\D/g, '');  // Remove qualquer coisa que não seja número
}

// Função para consultar o CEP e preencher os campos de endereço
function consultarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');  // Remove caracteres não numéricos

    if (cep.length === 8) {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => alert("Erro ao consultar o CEP."));
    }
}
