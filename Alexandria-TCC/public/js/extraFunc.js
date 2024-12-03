function alertaao(mensagem) {
    alert(mensagem);
}

function upMensagem(conversaId, msgId, msgTexto, tipo) {
    alert(conversaId + " " + msgId);
    console.log(msgTexto + " ")
    if (tipo == 1) {
        try {
            var mensagem = msgTexto;
            mensagem.replace("r-con", "rb-con");
            alert (mensagem);
            //updateDoc(doc(banco, "conversas", conversaId, "mensagens", msgId), {
            //    texto_msg:
            //});
        } catch (e) {
            alert ("Erro ao confirmar recibo.")
        }
    } else if (tipo == 2) {
        alert("outro");
    }
}