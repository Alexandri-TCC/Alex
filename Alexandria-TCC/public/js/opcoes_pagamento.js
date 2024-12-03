document.addEventListener("DOMContentLoaded", () => {
    const radioDebito = document.getElementById("cartao-debito");
    const radioCredito = document.getElementById("cartao-credito");
    const radioPix = document.getElementById("radio-pix"); // Botão rádio para Pix
    const containerOpcoes = document.getElementById("container-opcoes");
    const containerPagamento = document.getElementById("container-pagamento");
    const containerPix = document.getElementById("container-pix"); // Container Pix
    const setaVoltarDebito = document.getElementById("voltar-debito");
    const setaVoltarPix = document.getElementById("voltar-pix"); // Seta do Pix

    // Quando o radio "Cartão de Débito" é selecionado
    radioDebito.addEventListener("change", () => {
        if (radioDebito.checked) {
            containerOpcoes.style.display = "none";
            containerPagamento.style.display = "block";
            containerPix.style.display = "none";
        }
    });

    // Quando o radio "Cartão de Crédito" é selecionado
    radioCredito.addEventListener("change", () => {
        if (radioCredito.checked) {
            containerOpcoes.style.display = "none";
            containerPagamento.style.display = "block";
            containerPix.style.display = "none";
        }
    });

    // Quando o radio "Pix" é selecionado
    radioPix.addEventListener("change", () => {
        if (radioPix.checked) {
            containerOpcoes.style.display = "none";
            containerPix.style.display = "block";
            containerPagamento.style.display = "none";
        }
    });

    // Função para configurar o comportamento da seta de voltar
    function configurarSetaVoltar(seta, containerAtual, containerOutro) {
        seta.addEventListener("click", () => {
            const confirmarVoltar = confirm("Ao voltar, as informações não serão salvas. Deseja continuar?");
            if (confirmarVoltar) {
                containerAtual.style.display = "none";
                containerOutro.style.display = "none";
                containerOpcoes.style.display = "block";
            }
        });
    }

    // Configurar as setas de voltar para todos os formulários
    configurarSetaVoltar(setaVoltarDebito, containerPagamento, containerPagamento);
    configurarSetaVoltar(setaVoltarPix, containerPix, containerPagamento); // Adicionando para o Pix
});
