import {banco, verificador} from "./firebase/configuracao.js";
import {buscaLivroISBN, buscaLivroTexto} from "./firebase/configLivro.js"; 
import {onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, getDocs, where, query, deleteDoc }
from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const formEdit = document.getElementById("formEdit");
const btnEdit = document.getElementById("btnEdit");




formEdit.addEventListener("submit", async (event) => {
    event.preventDefault();

    btnEdit.disabled = true;
    const usu = verificador.currentUser.uid;
    

    const nomeEdit = document.getElementById("nomeEdit").value;
    const cidadeEdit = document.getElementById("cidadeEdit").value;
    const imgEdit = document.getElementById("imgEdit").files[0];
    const resultado = await getDoc(doc(banco, "usuarios", usu));
    var fileUrl = '';

    await setDoc(doc(banco, "usuarios", usu), {
        nome_usu: nomeEdit,
        email_usu: resultado.data().email_usu,
        tipo_usu: resultado.data().tipo_usu,
        documento_usu: resultado.data().documento_usu,
        cidade_usu: cidadeEdit
    });

    if(!imgEdit) {
        console.log("")
    } else {
        if (!imgEdit.type.startsWith("image/")) {
            alert("Por favor, selecione um arquivo de imagem válido (JPG, JPEG ou PNG).");
            return;
        }

        const formData = new FormData();
        formData.append("file", imgEdit);
        formData.append("upload_preset", "ml_default");

        console.log("Enviando imagem para o Cloudinary...");

        const response = await fetch("https://api.cloudinary.com/v1_1/dwxftry8e/image/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Resposta do Cloudinary:", data.secure_url);

        fileUrl = data.secure_url;
        console.log(fileUrl);


        const resultado1 = await getDoc(doc(banco, "usuarios", usu, "perfil", "dados"));

        await setDoc(doc(banco, "usuarios", usu, "perfil", "dados"), {
        foto_usu: fileUrl,
        moedas_usu: resultado1.data().moedas_usu,
        nivel_usu: resultado1.data().nivel_usu
    }); // */
    }

    
  
    alert ("Informações editadas com sucesso.");
    //window.location.href = `perfil_livro_usuario.html?id=${idObra}`;
    window.location.href = "perfil.html";
    btnEdit.disabled = false;
  });